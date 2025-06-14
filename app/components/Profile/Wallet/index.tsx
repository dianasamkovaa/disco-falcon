import type { AssetType } from "~/types/asset.type";
import WalletItem from "~/components/Profile/Wallet/components/Item";

const list: AssetType[] = [
  {
    type: "gold",
    weight: 50,
    purity: 999,
    certificate: "123123123",
    storage: "Vault A",
  },
  {
    type: "gold",
    weight: 50,
    purity: 999,
    certificate: "223123123",
    storage: "Vault A",
  },
  {
    type: "gold",
    weight: 50,
    purity: 999,
    certificate: "323123123",
    storage: "Vault A",
  },
  {
    type: "gold",
    weight: 50,
    purity: 999,
    certificate: "423123123",
    storage: "Vault A",
  },
];

const Wallet = () => {
  const nftList = list;

  return (
    <div className="flex gap-6 mt-12 wrap">
      {nftList.map((item) => (
        <WalletItem key={item.certificate} item={item} />
      ))}
    </div>
  );
};

export default Wallet;
