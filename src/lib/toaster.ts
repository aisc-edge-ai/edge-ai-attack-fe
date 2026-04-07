import { OverlayToaster, Position } from '@blueprintjs/core';

/** Shared app-wide toaster instance */
export const AppToaster = OverlayToaster.createAsync({
  position: Position.TOP_RIGHT,
});
