/* eslint-disable @typescript-eslint/no-explicit-any */
// import FollowButton from "../Buttons/FollowButton";
import { Heart } from "lucide-react";
// import { MessageCircle, Send, } from "lucide-react";
import { isEmpty, isNil } from "ramda";
import cls from "classnames";
import { Pin } from ".";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getPinDetailByPid } from '../../api/pin';
import { btcConnectorAtom, connectedAtom, initStillPoolAtom } from "../../store/user";
import { useAtomValue } from "jotai";
import CustomAvatar from "../CustomAvatar";
// import { sleep } from '../../utils/time';
import { toast } from "react-toastify";
import { fetchCurrentProtocolLikes } from "../../api/protocol";
import { checkMetaletConnected, checkMetaletInstalled } from "../../utils/wallet";
// import { temp_protocol } from '../../utils/mockData';
import "./styles.css";
import { useNavigate } from "react-router-dom";
type IProps = {
	protocolItem: Pin | undefined;
};

const ProtocolCard = ({ protocolItem }: IProps) => {
	const connected = useAtomValue(connectedAtom);

	const btcConnector = useAtomValue(btcConnectorAtom);
	const stillPool = useAtomValue(initStillPoolAtom);

	const queryClient = useQueryClient();

	const summary = protocolItem!.contentSummary;
	const isSummaryJson = summary.startsWith("{") && summary.endsWith("}");
	const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

	// const attachPids = isSummaryJson
	//   ? (parseSummary?.attachments ?? []).map(
	//       (d: string) => d.split('metafile://')[1]
	//     )
	//   : [];

	const { data: currentLikeData } = useQuery({
		queryKey: ["payLike", protocolItem!.id],
		queryFn: () => fetchCurrentProtocolLikes(protocolItem!.id),
	});
	const isLikeByCurrentUser = (currentLikeData ?? []).find(
		(d) => d.pinAddress === btcConnector?.address
	);

	const currentUserInfoData = useQuery({
		queryKey: ["userInfo", protocolItem!.address],
		queryFn: () => btcConnector?.getUser(protocolItem!.address),
	});
	// console.log("current user data", currentUserInfoData.data);

	// const attachData = useQueries({
	//   queries: (attachPids ?? []).map((id: string) => {
	//     return {
	//       queryKey: ['post', id],
	//       queryFn: () => getPinDetailByPid({ pid: id }),
	//     };
	//   }),
	//   combine: (results: any) => {
	//     return {
	//       data: results.map((result: any) => result.data),
	//       pending: results.some((result: any) => result.isPending),
	//     };
	//   },
	// });

	const handleLike = async (pinId: string) => {
		await checkMetaletInstalled();
		await checkMetaletConnected(connected);
		if (stillPool) {
			return;
		}
		if (isLikeByCurrentUser) {
			toast.error("You have already liked that protocol...", {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
			return;
		}

		const likeEntity = await btcConnector!.use("like");
		try {
			const likeRes = await likeEntity.create({
				options: [
					{
						body: JSON.stringify({ isLike: "1", likeTo: pinId }),
					},
				],
				noBroadcast: "no",
			});
			console.log("likeRes", likeRes);
			if (!isNil(likeRes?.revealTxIds[0])) {
				queryClient.invalidateQueries({ queryKey: ["metaprotocols"] });
				queryClient.invalidateQueries({
					queryKey: ["payLike", protocolItem!.id],
				});
				// await sleep(5000);
				toast.success("like protocol successfully");
			}
		} catch (error) {
			console.log("error", error);
			const errorMessage = (error as any)?.message;
			const toastMessage = errorMessage.includes("Cannot read properties of undefined")
				? "User Canceled"
				: errorMessage;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.error(toastMessage, {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
		}
	};
	const navigate = useNavigate();

	if (isNil(protocolItem)) {
		return <div>can't fetch this protocol</div>;
	}
	return (
		<>
			<div className="card" onClick={() => navigate(`/protocol/${protocolItem.id}`)}>
				<div className="card-content gap-4 justify-between">
					<div className="flex flex-col gap-1">
						<div className="font-mono text-xl font-bold">
							{parseSummary.protocolTitle}
						</div>
						<div className="flex gap-2 items-center">
							{parseSummary.tags.map((d: string) => {
								return (
									<div
										key={d}
										className="hover:bg-slate-600   text-xs font-thin text-main bg-[black] rounded-full px-2.5 pt-0.5 pb-1  text-center"
									>
										{d}
									</div>
								);
							})}
						</div>
					</div>
					<div className="text-xs text-wrap break-all truncate">
						{parseSummary.protocolIntroduction.split(".")[0]}
					</div>

					<div className="flex justify-between items-center">
						<div className="flex gap-2 items-center">
							{isNil(currentUserInfoData.data) ? (
								<div className="avatar placeholder">
									<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-10">
										<span>{protocolItem!.address.slice(-4, -2)}</span>
									</div>
								</div>
							) : (
								<CustomAvatar size={8} userInfo={currentUserInfoData.data} />
							)}
							<div className="text-gray text-xs">
								{isNil(currentUserInfoData?.data?.name) ||
								isEmpty(currentUserInfoData?.data?.name)
									? "metaid-user-" + protocolItem.address.slice(-4)
									: currentUserInfoData?.data?.name}
							</div>
						</div>
						<div className="flex gap-2">
							<Heart
								size={18}
								className={cls(
									{ "text-[red]": isLikeByCurrentUser },
									"text-slate-50/50 hover:scale-[1.3] duration-1000"
								)}
								fill={isLikeByCurrentUser && "red"}
								onClick={(e) => {
									e.stopPropagation();
									handleLike(protocolItem!.id);
								}}
							/>
							{!isNil(currentLikeData) ? currentLikeData.length : null}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProtocolCard;
