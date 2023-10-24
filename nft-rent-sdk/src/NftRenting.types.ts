import {} from "./types";
export type Addr = string;
export interface InstantiateMsg {
  admin?: Addr | null;
  cw721_contract: string;
  name?: string | null;
  version?: string | null;
}
export type ExecuteMsg = {
  receive_nft: Cw721ReceiveMsg;
} | {
  rent_nft: {
    cw721_contract: string;
    token_id: string;
  };
} | {
  edit_lending_order: {
    cw721_contract: string;
    lend_amount: Uint128;
    lend_time: number;
    token_id: string;
  };
} | {
  delist_nft: {
    cw721_contract: string;
    token_id: string;
  };
};
export type Binary = string;
export type Uint128 = string;
export interface Cw721ReceiveMsg {
  msg: Binary;
  sender: string;
  token_id: string;
}
export type QueryMsg = {
  contract_info: {};
} | {
  lend_order: {
    cw721_contract: string;
    token_id: string;
  };
} | {
  rent_order: {
    cw721_contract: string;
    token_id: string;
  };
};
export interface ContractInfoResponse {
  admin: Addr;
  name: string;
  version: string;
}
export interface LendOrderResponse {
  lend_amount: Uint128;
  lend_time: number;
  lender: string;
  nft_contract: string;
  nft_id: string;
}
export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export type Uint64 = string;
export interface RentOrderResponse {
  expiration: Expiration;
  nft_contract: string;
  nft_id: string;
  rent_amount: Uint128;
  renter: string;
}