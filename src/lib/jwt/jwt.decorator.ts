import { Inject } from '@nestjs/common';

import { JwtService } from './jwt.service';

export const InjectJWT = () => Inject(JwtService);
