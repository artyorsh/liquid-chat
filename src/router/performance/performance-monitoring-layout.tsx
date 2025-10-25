import { createElement, FC, Profiler, ProfilerOnRenderCallback } from 'react';
import { ILayoutProps } from '../react-navigation/stack-tree-factory';

import { ILogger } from '@/log';

type IProfilerOnRenderPhase =
  | 'mount'
  | 'update'
  | 'nested-update';

export interface IPerformanceMonitoringLayoutConfig {
  logger: ILogger;
  watchPhases: IProfilerOnRenderPhase[];
}

export const createPerformanceMonitoringLayout = (config: IPerformanceMonitoringLayoutConfig): FC<ILayoutProps> => {
  const PerformanceMonitoringLayout: FC<ILayoutProps> = ({ routeName, children }) => {
    const onRender: ProfilerOnRenderCallback = (_, phase, actualDuration, _baseDuration, _startTime, _commitTime) => {
      if (!config.watchPhases.includes(phase)) {
        return;
      }

      const readableMilliseconds: string = `${actualDuration.toFixed(2)}ms`;
      config.logger.debug(`Measured ${readableMilliseconds} to ${phase} ${routeName}`);
    };

    return createElement(Profiler, { id: routeName, onRender }, children);
  };

  return PerformanceMonitoringLayout;
};
