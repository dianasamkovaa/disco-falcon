import type { Abi, Log, PublicClient } from "viem";
import { getContractEvents } from "viem/actions";

const MAX_BLOCK_RANGE = 10_000n;

type FetchLogsInChunksParams<TAbi extends Abi, TEventName extends string> = {
  client: PublicClient;
  abi: TAbi;
  eventName: TEventName;
  address: `0x${string}`;
  args?: Record<string, any>;
  fromBlock: bigint;
  toBlock?: bigint;
};

const fetchLogsInChunks = async <TAbi extends Abi, TEventName extends string>({
  client,
  abi,
  eventName,
  address,
  args,
  fromBlock,
  toBlock,
}: FetchLogsInChunksParams<TAbi, TEventName>) => {
  const latestBlock = toBlock ?? (await client.getBlockNumber());
  const allEvents: Log[] = [];

  for (let from = fromBlock; from <= latestBlock; from += MAX_BLOCK_RANGE) {
    const to =
      from + MAX_BLOCK_RANGE > latestBlock
        ? latestBlock
        : from + MAX_BLOCK_RANGE;

    const chunk = await getContractEvents(client, {
      address,
      abi,
      eventName,
      args,
      fromBlock: from,
      toBlock: to,
    });

    allEvents.push(...chunk);
  }

  return allEvents;
};

export default fetchLogsInChunks;
