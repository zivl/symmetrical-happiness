import chalk from 'chalk';

import logger from '../../Logger';
import { Task } from '../../TasksRunner';
import { Parcel, TaskArgs } from '../types';
import { resolveReleaseTypeAndVersion } from './resolveReleaseTypeAndVersion';

const { green, gray } = chalk;

/**
 * Cuts off changelogs - renames unpublished section header
 * to the new version and adds new unpublished section on top.
 */
export const cutOffChangelogs = new Task<TaskArgs>(
  {
    name: 'cutOffChangelogs',
    dependsOn: [resolveReleaseTypeAndVersion],
    filesToStage: ['packages/**/CHANGELOG.md'],
  },
  async (parcels: Parcel[]) => {
    logger.info('\n✂️  Cutting off changelogs...');

    await Promise.all(
      parcels.map(async ({ pkg, changelog, state }) => {
        if (!state.releaseVersion) {
          return;
        }

        let skipReason = '';

        if (await changelog.fileExistsAsync()) {
          const versions = await changelog.getVersionsAsync();

          // This prevents unnecessary cut-offs when that version was already cutted off.
          // Maybe we should move "unpublished" entries to this version? It's probably too rare to worry about it.
          if (!versions.includes(state.releaseVersion)) {
            logger.log('  ', green(pkg.packageName) + '...');
            await changelog.cutOffAsync(state.releaseVersion);
            await changelog.saveAsync();
            return;
          }
          skipReason = 'version already exists';
        } else {
          skipReason = 'no changelog file';
        }
        logger.log('  ', green(pkg.packageName), gray(`- skipped, ${skipReason}`));
      })
    );
  }
);