// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import {codegen, validateEntityName} from './codegen-controller';

jest.mock('fs', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fsMock = jest.createMockFromModule('fs') as any;
  fsMock.promises = {
    mkdir: jest.fn(),
  };
  return fsMock;
});

jest.mock('rimraf', () => {
  return jest.createMockFromModule('rimraf') as unknown;
});

jest.setTimeout(30000);

describe('Codegen can generate schema (mocked)', () => {
  const projectPath = path.join(__dirname, '../../test/test1');
  it('throw error when make directory failed at beginning of codegen', async () => {
    (rimraf as unknown as jest.Mock).mockImplementation((path, cb) => cb());
    (fs.promises.mkdir as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));
    await expect(codegen(projectPath)).rejects.toThrow(/Failed to prepare/);
  });

  it('test codegen reserved key validate', () => {
    const good_name = 'exampleFilterEntity';
    const good_result = validateEntityName(good_name);
    expect(good_result).toEqual(good_name);

    const bad_name = 'exampleEntityFilters';
    expect(() => validateEntityName(bad_name)).toThrow(
      'EntityName: exampleEntityFilters cannot end with reservedKey: filters'
    );
  });
});
