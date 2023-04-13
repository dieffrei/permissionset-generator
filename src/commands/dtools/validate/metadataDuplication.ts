/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import {flags, SfdxCommand} from '@salesforce/command';
import {Messages} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types';
import {ComponentSet, MetadataComponent} from "@salesforce/source-deploy-retrieve";

interface HashMap<T> {
  [key: string]: T
}

interface MetadataByPackage {
  metadataComponent: MetadataComponent;
  paths: string[];
}

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('permissionset-generator', 'org');

export default class MetadataDuplication extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  protected static flagsConfig = {
    path: flags.directory({
      char: 'p',
      description: 'Source path',
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    //const scannedMetadata: HashMap<MetadataByPackage> = {};
    let componentSet: ComponentSet = ComponentSet.fromSource({
      fsPaths: [this.flags.path],
    });
    await this.mapComponents(this.flags.path, componentSet)
    return {};
  }

  public async mapComponents(path:string, componentSet: ComponentSet): Promise<HashMap<MetadataByPackage>> {
    const metadataScan: HashMap<MetadataByPackage> = {};
    for (let metadataComponent of componentSet.toArray()) {
      metadataScan[metadataComponent.fullName] = {
        metadataComponent : metadataComponent,
        paths : [path]
      }
    }
    return metadataScan
  }

}
