import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import BackButton from "../components/Buttons/BackButton";
import { getPinDetailByPid } from "../api/pin";
import { ProtocolItem } from "../types";
import JsonFormatter from "react-json-formatter";

import "./styles.css";
const Protocol = () => {
	const { id: pinId } = useParams();
	const { data: protocolDetailData } = useQuery({
		queryKey: ["protocol", pinId],
		queryFn: () => getPinDetailByPid({ pid: pinId! }),
	});

	const summary = protocolDetailData?.contentSummary;
	const isSummaryJson = summary?.startsWith("{") && summary?.endsWith("}");
	const parseSummary: ProtocolItem = isSummaryJson ? JSON.parse(summary ?? `{}`) : {};

	const jsonStyle = {
		propertyStyle: { color: "red", fontSize: "13px" },
		stringStyle: { color: "green", fontSize: "13px" },
		numberStyle: { color: "darkorange", fontSize: "13px" },
	};

	console.log("detail", protocolDetailData);
	console.log("summary", parseSummary);
	return (
		<div>
			<BackButton />

			<div className="bg-[black]  border border-slate-50/10 rounded-lg w-full h-full p-10 flex flex-col gap-4">
				<div className="flex gap-6 items-center">
					<div className="text-[36px]">{parseSummary?.protocolTitle} </div>
					<div className="flex gap-2 mt-1">
						{(parseSummary?.tags ?? []).map((d: string) => {
							return (
								<div className="bg-[#0B1A30] text-sm font-normal text-[#056DFA] rounded-full px-4 pt-0.5 pb-1  text-center">
									{d}
								</div>
							);
						})}
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6 text-gray-500">
					<div className="flex items-center gap-1">
						<img
							src={`/detail-version-icon.png`}
							alt="logo"
							className="w-[30px] h-[30px]"
						/>
						<div>version: {parseSummary?.protocolVersion} </div>
					</div>
					<div className="flex items-center gap-1 col-span-2">
						<img
							src={`/detail-name-icon.png`}
							alt="logo"
							className="w-[30px] h-[30px]"
						/>
						<div>name: {parseSummary?.protocolName} </div>
					</div>
					<div className="flex items-center gap-1">
						<img
							src={`/detail-encoding-icon.png`}
							alt="logo"
							className="w-[30px] h-[30px] mt-1"
						/>
						<div className="">encoding: {parseSummary?.protocolEncoding} </div>
					</div>
					<div className="flex items-center gap-1 col-span-2">
						<img
							src={`/detail-brfcid-icon.png`}
							alt="logo"
							className="w-[30px] h-[30px]"
						/>
						<div>brfcId: {parseSummary?.protocolHASHID} </div>
					</div>
				</div>
				<div className="border border-b-0 border-gray-500/50 my-8"></div>
				<div className="text-[24px]">Protocol Content</div>
				<div className="bg-[#131314] p-8 rounded-lg">
					<JsonFormatter
						json={parseSummary?.protocolContent}
						tabWith={4}
						jsonStyle={jsonStyle}
					/>
				</div>
				<div>Protocol Description</div>
				<div className="bg-[#131314] p-8 rounded-lg">
					<div>{parseSummary?.protocolDescription}</div>
				</div>
			</div>
		</div>
	);
};

export default Protocol;
