// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  StoreService,
  PoiService,
  MmrService,
  NodeConfig,
  ConnectionPoolService,
} from '@subql/node-core';
import { SubqueryProject } from '../configure/SubqueryProject';
import { ApiService } from './api.service';
import { ApiPromiseConnection } from './apiPromise.connection';
import { DsProcessorService } from './ds-processor.service';
import { DynamicDsService } from './dynamic-ds.service';
import { IndexerManager } from './indexer.manager';
import { ProjectService } from './project.service';
import { WorkerRuntimeService } from './runtime/workerRuntimeService';
import { SandboxService } from './sandbox.service';
import { UnfinalizedBlocksService } from './unfinalizedBlocks.service';
import { WorkerService } from './worker/worker.service';

@Module({
  providers: [
    IndexerManager,
    StoreService,
    ConnectionPoolService,
    {
      provide: ApiService,
      useFactory: async (
        project: SubqueryProject,
        connectionPoolService: ConnectionPoolService<ApiPromiseConnection>,
        eventEmitter: EventEmitter2,
        nodeConfig: NodeConfig,
      ) => {
        const apiService = new ApiService(
          project,
          connectionPoolService,
          eventEmitter,
          nodeConfig,
        );
        await apiService.init();
        return apiService;
      },
      inject: [
        'ISubqueryProject',
        ConnectionPoolService,
        EventEmitter2,
        NodeConfig,
      ],
    },
    SandboxService,
    DsProcessorService,
    DynamicDsService,
    PoiService,
    MmrService,
    ProjectService,
    WorkerService,
    UnfinalizedBlocksService,
    WorkerRuntimeService,
  ],
  exports: [StoreService, MmrService],
})
export class IndexerModule {}
