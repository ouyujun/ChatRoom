import { ConfigLoaderService } from './config-loder.service';

export function PreloadFactory(configService: ConfigLoaderService) {
  return () => configService.initialize();
}
