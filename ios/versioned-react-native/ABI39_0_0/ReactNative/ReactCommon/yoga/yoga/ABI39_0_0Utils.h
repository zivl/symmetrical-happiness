/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once
#include "ABI39_0_0YGNode.h"
#include "ABI39_0_0Yoga-internal.h"
#include "ABI39_0_0CompactValue.h"

// This struct is an helper model to hold the data for step 4 of flexbox algo,
// which is collecting the flex items in a line.
//
// - itemsOnLine: Number of items which can fit in a line considering the
//   available Inner dimension, the flex items computed flexbasis and their
//   margin. It may be different than the difference between start and end
//   indicates because we skip over absolute-positioned items.
//
// - sizeConsumedOnCurrentLine: It is accumulation of the dimensions and margin
//   of all the children on the current line. This will be used in order to
//   either set the dimensions of the node if none already exist or to compute
//   the remaining space left for the flexible children.
//
// - totalFlexGrowFactors: total flex grow factors of flex items which are to be
//   layed in the current line
//
// - totalFlexShrinkFactors: total flex shrink factors of flex items which are
//   to be layed in the current line
//
// - endOfLineIndex: Its the end index of the last flex item which was examined
//   and it may or may not be part of the current line(as it may be absolutely
//   positioned or including it may have caused to overshoot availableInnerDim)
//
// - relativeChildren: Maintain a vector of the child nodes that can shrink
//   and/or grow.

struct ABI39_0_0YGCollectFlexItemsRowValues {
  uint32_t itemsOnLine;
  float sizeConsumedOnCurrentLine;
  float totalFlexGrowFactors;
  float totalFlexShrinkScaledFactors;
  uint32_t endOfLineIndex;
  std::vector<ABI39_0_0YGNodeRef> relativeChildren;
  float remainingFreeSpace;
  // The size of the mainDim for the row after considering size, padding, margin
  // and border of flex items. This is used to calculate maxLineDim after going
  // through all the rows to decide on the main axis size of owner.
  float mainDim;
  // The size of the crossDim for the row after considering size, padding,
  // margin and border of flex items. Used for calculating containers crossSize.
  float crossDim;
};

bool ABI39_0_0YGValueEqual(const ABI39_0_0YGValue& a, const ABI39_0_0YGValue& b);
inline bool ABI39_0_0YGValueEqual(
    ABI39_0_0facebook::yoga::detail::CompactValue a,
    ABI39_0_0facebook::yoga::detail::CompactValue b) {
  return ABI39_0_0YGValueEqual((ABI39_0_0YGValue) a, (ABI39_0_0YGValue) b);
}

// This custom float equality function returns true if either absolute
// difference between two floats is less than 0.0001f or both are undefined.
bool ABI39_0_0YGFloatsEqual(const float a, const float b);

float ABI39_0_0YGFloatMax(const float a, const float b);

ABI39_0_0YGFloatOptional ABI39_0_0YGFloatOptionalMax(
    const ABI39_0_0YGFloatOptional op1,
    const ABI39_0_0YGFloatOptional op2);

float ABI39_0_0YGFloatMin(const float a, const float b);

// This custom float comparison function compares the array of float with
// ABI39_0_0YGFloatsEqual, as the default float comparison operator will not work(Look
// at the comments of ABI39_0_0YGFloatsEqual function).
template <std::size_t size>
bool ABI39_0_0YGFloatArrayEqual(
    const std::array<float, size>& val1,
    const std::array<float, size>& val2) {
  bool areEqual = true;
  for (std::size_t i = 0; i < size && areEqual; ++i) {
    areEqual = ABI39_0_0YGFloatsEqual(val1[i], val2[i]);
  }
  return areEqual;
}

// This function returns 0 if ABI39_0_0YGFloatIsUndefined(val) is true and val otherwise
float ABI39_0_0YGFloatSanitize(const float val);

ABI39_0_0YGFlexDirection ABI39_0_0YGFlexDirectionCross(
    const ABI39_0_0YGFlexDirection flexDirection,
    const ABI39_0_0YGDirection direction);

inline bool ABI39_0_0YGFlexDirectionIsRow(const ABI39_0_0YGFlexDirection flexDirection) {
  return flexDirection == ABI39_0_0YGFlexDirectionRow ||
      flexDirection == ABI39_0_0YGFlexDirectionRowReverse;
}

inline ABI39_0_0YGFloatOptional ABI39_0_0YGResolveValue(
    const ABI39_0_0YGValue value,
    const float ownerSize) {
  switch (value.unit) {
    case ABI39_0_0YGUnitPoint:
      return ABI39_0_0YGFloatOptional{value.value};
    case ABI39_0_0YGUnitPercent:
      return ABI39_0_0YGFloatOptional{value.value * ownerSize * 0.01f};
    default:
      return ABI39_0_0YGFloatOptional{};
  }
}

inline ABI39_0_0YGFloatOptional ABI39_0_0YGResolveValue(
    yoga::detail::CompactValue value,
    float ownerSize) {
  return ABI39_0_0YGResolveValue((ABI39_0_0YGValue) value, ownerSize);
}

inline bool ABI39_0_0YGFlexDirectionIsColumn(const ABI39_0_0YGFlexDirection flexDirection) {
  return flexDirection == ABI39_0_0YGFlexDirectionColumn ||
      flexDirection == ABI39_0_0YGFlexDirectionColumnReverse;
}

inline ABI39_0_0YGFlexDirection ABI39_0_0YGResolveFlexDirection(
    const ABI39_0_0YGFlexDirection flexDirection,
    const ABI39_0_0YGDirection direction) {
  if (direction == ABI39_0_0YGDirectionRTL) {
    if (flexDirection == ABI39_0_0YGFlexDirectionRow) {
      return ABI39_0_0YGFlexDirectionRowReverse;
    } else if (flexDirection == ABI39_0_0YGFlexDirectionRowReverse) {
      return ABI39_0_0YGFlexDirectionRow;
    }
  }

  return flexDirection;
}

inline ABI39_0_0YGFloatOptional ABI39_0_0YGResolveValueMargin(
    yoga::detail::CompactValue value,
    const float ownerSize) {
  return value.isAuto() ? ABI39_0_0YGFloatOptional{0} : ABI39_0_0YGResolveValue(value, ownerSize);
}