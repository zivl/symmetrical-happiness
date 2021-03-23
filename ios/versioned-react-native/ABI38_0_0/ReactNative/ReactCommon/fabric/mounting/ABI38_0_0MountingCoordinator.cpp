/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ABI38_0_0MountingCoordinator.h"

#ifdef ABI38_0_0RN_SHADOW_TREE_INTROSPECTION
#include <glog/logging.h>
#endif

#include <condition_variable>

#include <ABI38_0_0React/mounting/Differentiator.h>
#include <ABI38_0_0React/mounting/ShadowViewMutation.h>
#include <ABI38_0_0React/utils/TimeUtils.h>

namespace ABI38_0_0facebook {
namespace ABI38_0_0React {

MountingCoordinator::MountingCoordinator(ShadowTreeRevision baseRevision)
    : surfaceId_(baseRevision.getRootShadowNode().getSurfaceId()),
      baseRevision_(baseRevision) {
#ifdef ABI38_0_0RN_SHADOW_TREE_INTROSPECTION
  stubViewTree_ = stubViewTreeFromShadowNode(baseRevision_.getRootShadowNode());
#endif
}

SurfaceId MountingCoordinator::getSurfaceId() const {
  return surfaceId_;
}

void MountingCoordinator::push(ShadowTreeRevision &&revision) const {
  {
    std::lock_guard<std::mutex> lock(mutex_);

    assert(revision.getNumber() > baseRevision_.getNumber());
    assert(
        !lastRevision_.has_value() ||
        revision.getNumber() != lastRevision_->getNumber());

    if (!lastRevision_.has_value() ||
        lastRevision_->getNumber() < revision.getNumber()) {
      lastRevision_ = std::move(revision);
    }
  }

  signal_.notify_all();
}

void MountingCoordinator::revoke() const {
  std::lock_guard<std::mutex> lock(mutex_);
  // We have two goals here.
  // 1. We need to stop retaining `ShadowNode`s to not prolong their lifetime
  // to prevent them from overliving `ComponentDescriptor`s.
  // 2. A possible call to `pullTransaction()` should return empty optional.
  baseRevision_.rootShadowNode_.reset();
  lastRevision_.reset();
}

bool MountingCoordinator::waitForTransaction(
    std::chrono::duration<double> timeout) const {
  std::unique_lock<std::mutex> lock(mutex_);
  return signal_.wait_for(
      lock, timeout, [this]() { return lastRevision_.has_value(); });
}

better::optional<MountingTransaction> MountingCoordinator::pullTransaction()
    const {
  std::lock_guard<std::mutex> lock(mutex_);

  if (!lastRevision_.has_value()) {
    return {};
  }

  number_++;

  auto telemetry = lastRevision_->getTelemetry();
  telemetry.willDiff();

  auto mutations = calculateShadowViewMutations(
      baseRevision_.getRootShadowNode(), lastRevision_->getRootShadowNode());

  telemetry.didDiff();

#ifdef ABI38_0_0RN_SHADOW_TREE_INTROSPECTION
  stubViewTree_.mutate(mutations);
  auto stubViewTree =
      stubViewTreeFromShadowNode(lastRevision_->getRootShadowNode());
  if (stubViewTree_ != stubViewTree) {
    LOG(ERROR) << "Old tree:"
               << "\n"
               << baseRevision_.getRootShadowNode().getDebugDescription()
               << "\n";
    LOG(ERROR) << "New tree:"
               << "\n"
               << lastRevision_->getRootShadowNode().getDebugDescription()
               << "\n";
    LOG(ERROR) << "Mutations:"
               << "\n"
               << getDebugDescription(mutations, {});
    assert(false);
  }
#endif

  baseRevision_ = std::move(*lastRevision_);
  lastRevision_.reset();

  return MountingTransaction{
      surfaceId_, number_, std::move(mutations), telemetry};
}

} // namespace ABI38_0_0React
} // namespace ABI38_0_0facebook