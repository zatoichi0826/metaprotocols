export type BtcNetwork = 'mainnet' | 'testnet' | 'regtest';

export type Pin = {
  id: string;
  number: number;
  rootTxId: string;
  address: string;
  output: string;
  outputValue: number;
  timestamp: number;
  genesisFee: number;
  genesisHeight: number;
  genesisTransaction: string;
  txInIndex: number;
  txInOffset: number;
  operation: string;
  path: string;
  parentPath: string;
  encryption: string;
  version: string;
  contentType: string;
  contentBody: string;
  contentLength: number;
  contentSummary: string;
  status: number;
  originalId: string;
  isTransfered: boolean;
  preview: string;
  content: string;
  pop: string;
  metaid: string;
};
