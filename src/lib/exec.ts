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

import * as aexec from '@actions/exec'
export interface ExecResult {
  success: boolean
  stdout: string
  stderr: string
}

export const exec = async (
  command: string,
  args: string[] = [],
  silent?: boolean,
  env?: Record<string, string>
): Promise<ExecResult> => {
  const { exitCode, stdout, stderr } = await aexec.getExecOutput(
    command,
    args,
    {
      silent: silent,
      ignoreReturnCode: true,
      env: {
        ...(process.env as Record<string, string>),
        ...env
      }
    }
  )

  return {
    success: exitCode === 0,
    stdout: stdout.trim(),
    stderr: stderr.trim()
  }
}
