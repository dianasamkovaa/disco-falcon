import axios from "axios";
import config from "~/config";

type DataType = {
  weight: number;
  purity: number;
  certificateNumber: string;
  storageLocation: string;
};

const createMetadataURI = async (data: DataType) => {
  const metadata = {
    name: `Gold Asset`,
    description: `Tokenized Gold Asset - ${data.weight} g ${data.purity}`,
    image: "ipfs://QmahFJq3qfJ3iAAajsC7Gy59Tkvk8MkVoUrHCyin6USrpX",
    attributes: [
      {
        trait_type: "Weight",
        value: data.weight,
        unit: "grams",
      },
      {
        trait_type: "Purity",
        value: data.purity,
      },
      {
        trait_type: "Certificate ID",
        value: data.certificateNumber,
      },
      {
        trait_type: "Vault Location",
        value: data.storageLocation,
      },
    ],
    properties: data,
  };

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          Authorization: `Bearer ${config.PINATA_JWT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return `ipfs://${res.data.IpfsHash}`;
  } catch (err) {
    console.error("Pin JSON failed:", err);
    throw err;
  }
};

export default createMetadataURI;
