// Copyright Nitric Pty Ltd.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as io from '@actions/io'
import * as path from 'path'
import * as semver from 'semver'
import { getDownloadUrl, getInstalledVersion } from './utils'

const supportedPlatforms = ['linux']

export async function run() {
  try {
    const runnerPlatform = os.platform()
    // Check for git action platform compatibility
    // MacOS runner does not include docker and Windows runner cannot virtualize linux docker
    if (!supportedPlatforms.includes(runnerPlatform)) {
      throw new Error('Unsupported operating system. Needs to run on linux')
    }

    // Check version format
    const version = core.getInput('version')?.trim()
    if (!semver.valid(version) && version.toLowerCase() !== 'latest') {
      throw new Error('Incorrect version - Use semantic versioning E.g. 1.2.1')
    }

    // Download release version
    const url = await getDownloadUrl(version)
    let downloaded: string
    try {
      downloaded = await tc.downloadTool(url)
      core.info(`Successfully downloaded ${url.split('/').pop()}`)
    } catch (error) {
      throw new Error(`Could not download CLI from url : ${url}`)
    }

    // Extract and add to path
    const destination = path.join(os.homedir(), '.nitric', 'bin')
    core.info(`Install destination is ${destination}`)

    await io.mkdirP(destination)
    await tc.extractTar(downloaded, destination)

    const cachedPath = await tc.cacheDir(destination, 'nitric', version)
    core.addPath(cachedPath)

    const installedVersion = await getInstalledVersion()
    core.setOutput('version', installedVersion)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
