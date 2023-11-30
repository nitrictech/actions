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

import os from 'os'
import ky from 'ky'

const getArch = (arch: string) => {
  const mappings: Record<string, string> = {
    arm64: 'arm64'
  }

  return mappings[arch] || 'x86_64'
}

const getLatestVersion = async () => {
  try {
    // Fetch the latest release information
    const result = await ky
      .get('https://api.github.com/repos/nitrictech/cli/releases/latest')
      .json<{ tag_name: string }>()

    // Extract the tag name (version)
    const version = result.tag_name

    return version.replace(/^v/, '')
  } catch (error) {
    console.error('Error fetching latest release:', error)
  }
}

export const getDownloadUrl = async (version: string) => {
  const arch = getArch(os.arch())

  if (version.toLowerCase() === 'latest') {
    const latestVersion = await getLatestVersion()

    if (!latestVersion) {
      throw new Error('error finding latest nitric version')
    }

    version = latestVersion
  }

  const filename = `nitric_${version}_Linux_${arch}.tar.gz`

  return `https://github.com/nitrictech/cli/releases/download/v${version}/${filename}`
}
