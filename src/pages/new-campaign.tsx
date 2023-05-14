import { useState } from "react";
import { CreateVideoInput } from "./api/new-campaign";
import toast, { Toaster } from "react-hot-toast";
import { mainnet, useAccount } from "wagmi";
import { createPublicClient, http, isAddress } from "viem";

const sanitizeAddressList = async (addresses: string[]) => {
  const result: string[] = [];
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  for await (const address of addresses) {
    if (isAddress(address.trim())) {
      result.push(address);
    } else {
      // try resolving ens name
      const resolvedAddress = await publicClient.getEnsAddress({
        name: address.trim(),
      });
      if (
        resolvedAddress !== "0x0000000000000000000000000000000000000000" &&
        resolvedAddress
      ) {
        result.push(resolvedAddress);
      }
    }
  }

  return result;
};

export default function NewCampaignPage() {
  const { address } = useAccount();

  const [formState, setFormState] = useState<CreateVideoInput>({
    name: "",
    creator: address as string,
    assignees: [],
    budget: 1,
    clickTarget: 100,
    startDate: new Date(),
    endDate: new Date(),
    originalURL: "https://ankr.com",
  });

  const updateFormField =
    (field: keyof CreateVideoInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "assignees") {
        setFormState({
          ...formState,
          [field]: event.target.value.split(","),
        });
        return;
      }

      if (field === "startDate" || field === "endDate") {
        setFormState({
          ...formState,
          [field]: new Date(event.target.value),
        });
        return;
      }

      setFormState({ ...formState, [field]: event.target.value });
    };

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const sanitizedAddresses = await sanitizeAddressList(formState.assignees);

      toast.loading("Creating campaign...", {
        duration: 3000,
      });
      const res = await fetch("/api/new-campaign", {
        method: "POST",
        body: JSON.stringify({
          ...formState,
          assignees: sanitizedAddresses,
        }),
      });
      const json = await res.json();
      console.log(json);
      toast.success("Campaign created!");
    } catch (error) {
      toast.error("Error creating campaign. See the console for more details.");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />

      <h1>Create new campaign</h1>

      <form className="flex flex-col gap-4">
        <div className="form-control">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            className="input-bordered input"
            id="name"
            type="text"
            onChange={updateFormField("name")}
            value={formState.name}
          />
        </div>

        <div className="form-control">
          <label htmlFor="assignees" className="label">
            Assignees
          </label>
          <input
            className="input-bordered input"
            id="assignees"
            type="text"
            onChange={updateFormField("assignees")}
            value={formState.assignees.join(",")}
          />
        </div>

        <div className="flex gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Campaign budget</span>
            </label>
            <label className="input-group">
              <input
                type="number"
                className="input-bordered input"
                onChange={updateFormField("budget")}
                value={formState.budget}
              />
              <span>ETH</span>
            </label>
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Budget currency</span>
            </label>
            <select className="select-bordered select" disabled>
              <option disabled>Pick one</option>
              <option selected>$ETH</option>
              <option>$APE</option>
              <option>$GHO</option>
              <option>$USDC</option>
              <option>$WETH</option>
            </select>
            <label className="label">
              <span className="label-text-alt">ERC20 support coming soon!</span>
            </label>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="clickTarget" className="label">
            Click Target
          </label>
          <input
            className="input-bordered input"
            id="clickTarget"
            type="number"
            onChange={updateFormField("clickTarget")}
            value={formState.clickTarget}
          />
        </div>

        <div className="form-control">
          <label htmlFor="startDate" className="label">
            Start Date
          </label>
          <input
            className="input-bordered input"
            id="startDate"
            type="date"
            onChange={updateFormField("startDate")}
            value={formState.startDate.toISOString().split("T")[0]}
          />
        </div>

        <div className="form-control">
          <label htmlFor="endDate" className="label">
            End Date
          </label>
          <input
            className="input-bordered input"
            id="endDate"
            type="date"
            onChange={updateFormField("endDate")}
            value={formState.endDate.toISOString().split("T")[0]}
          />
        </div>

        <div className="form-control">
          <label htmlFor="originalURL" className="label">
            Original URL
          </label>
          <input
            className="input-bordered input"
            id="originalURL"
            type="text"
            onChange={updateFormField("originalURL")}
            value={formState.originalURL}
          />
        </div>

        <button
          onClick={onSubmit}
          className="btn-primary btn border-none bg-our-green text-black hover:bg-our-green-dark"
        >
          Create
        </button>
      </form>
    </>
  );
}
