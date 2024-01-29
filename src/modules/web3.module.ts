import { Module } from '@nestjs/common';
import { Web3Client } from 'providers/ethereum/web3.pvd';

@Module({
  providers: [Web3Client],
  exports: [Web3Client],
})
export class Web3Module {}
