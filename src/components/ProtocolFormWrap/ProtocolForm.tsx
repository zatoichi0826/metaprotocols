/* eslint-disable @typescript-eslint/no-explicit-any */
// import { FileEdit } from "lucide-react";
import { Paperclip } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import cls from "classnames";
import { IsEncrypt } from "../../utils/file";
import { isEmpty, isNil } from "ramda";
import TagInput from "./TagInput";
import { useState } from "react";

export interface AttachmentItem {
	fileName: string;
	fileType: string;
	data: string;
	encrypt: IsEncrypt;
	sha256: string;
	size: number;
	url: string;
}

type IProps = {
	onCreateSubmit: SubmitHandler<ProtocolFormData>;
	protocolFormHandle: UseFormReturn<ProtocolFormData, any, undefined>;
};

export type ProtocolFormData = {
	protocolTitle: string;
	protocolAttachments: FileList | undefined;
	protocolAuthor: string;
	protocolName: string;
	protocolVersion: string;
	protocolType: "application/json" | "image/apng" | "audio/aac";
	protocolEncoding: "UTF-8" | "text/plain" | "applicaiton/json" | "text/xml";
	protocolIntroduction: string;
	protocolIntroductionType: "text/plain" | "text/html" | "text/markdown"; // https://www.iana.org/assignments/charactersets/character-sets.xhtml
	protocolContent: string;
	protocolContentType: "text/plain" | "text/html" | "text/markdown";
	protocolDescription: string;
	protocolDescriptionType: "text/plain" | "text/html" | "text/markdown";
	tags: string[];
	relatedProtocols: string[];
};

const ProtocolForm = ({ onCreateSubmit, protocolFormHandle }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = protocolFormHandle;

	const files = watch("protocolAttachments");

	const [tags, setTags] = useState<string[]>([]);
	const onAddTag = (tag: string) => {
		protocolFormHandle.clearErrors("tags");
		setTags((d) => {
			return [...d, tag];
		});
	};

	const onDeleteTag = (tag: string) => {
		if (
			isEmpty(
				tags.filter((t) => {
					return t !== tag;
				})
			)
		) {
			protocolFormHandle.setError("tags", { type: "Required" });
		}
		setTags((d) => {
			return d.filter((t) => {
				return t !== tag;
			});
		});
	};
	const [relatedPros, setRelatedPros] = useState<string[]>([]);

	const onAddRelatedPros = (relatedPro: string) => {
		setRelatedPros((d) => {
			return [...d, relatedPro];
		});
	};

	const onDeleteRelatedPros = (relatedPro: string) => {
		setRelatedPros((d) => {
			return d.filter((t) => {
				return t !== relatedPro;
			});
		});
	};

	return (
		<form
			onSubmit={handleSubmit((data) =>
				onCreateSubmit({ ...data, tags, relatedProtocols: relatedPros })
			)}
			className="mt-8 flex flex-col gap-6"
		>
			<div className="flex flex-col gap-[24px] ">
				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolTitle,
						}
					)}
				>
					* Title
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolTitle", { required: true })}
					/>
					{errors.protocolTitle && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol title can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative",
						{
							"input-error": errors.protocolAuthor,
						}
					)}
				>
					* Author
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolAuthor", { required: true })}
					/>
					{errors.protocolAuthor && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol author can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolName,
						}
					)}
				>
					* Name
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolName", { required: true })}
					/>
					{errors.protocolName && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol Name can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolVersion,
						}
					)}
				>
					* Version
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolVersion", { required: true })}
					/>
					{errors.protocolVersion && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol Version can't be empty.
						</span>
					)}
				</label>
				<div className="flex items-center justify-between">
					<div className="text-white text-sm">* Type</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolType,
						})}
						{...register("protocolType", { required: true })}
					>
						<option>application/json</option>
						<option>image/apng</option>
					</select>
				</div>
				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* Encoding</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolEncoding,
						})}
						{...register("protocolEncoding", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Introduction</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolIntroduction,
						})}
						placeholder="Enter here"
						{...register("protocolIntroduction", { required: true })}
					></textarea>

					{errors.protocolIntroduction && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Introduction can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* IntroductionType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"textarea-error": errors.protocolIntroductionType,
						})}
						{...register("protocolIntroductionType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Content</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolContent,
						})}
						placeholder="Enter here"
						{...register("protocolContent", { required: true })}
					></textarea>
					{errors.protocolContent && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Content can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between">
					<div className="text-white text-sm">* ContentType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolContentType,
						})}
						{...register("protocolContentType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Description</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolDescription,
						})}
						placeholder="Enter here"
						{...register("protocolDescription", { required: true })}
					></textarea>
					{errors.protocolDescription && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Description can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* DescriptionType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolDescriptionType,
						})}
						{...register("protocolDescriptionType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>
				<div className="flex gap-2 items-center">
					<div className="text-white text-sm">* Tags </div>
					{errors.tags && (
						<div className="text text-error text-sm">tags can't be empty</div>
					)}
				</div>
				<TagInput
					onAddTag={onAddTag}
					onDeleteTag={onDeleteTag}
					tags={tags}
					placeHolder="enter here"
				/>

				<div className="collapse bg-base-200 border border-white mr-[8%]">
					<input type="checkbox" />
					<div className="collapse-title text-white text-md font-medium">
						Click To Show/Hide Optional Parameters
					</div>
					<div className="collapse-content">
						<div className="flex flex-col gap-[8px]">
							<div className="text-white text-sm">Related Protocols</div>
							<TagInput
								onAddTag={onAddRelatedPros}
								onDeleteTag={onDeleteRelatedPros}
								tags={relatedPros}
								placeHolder="enter here"
							/>
							<div className="flex items-center self-start gap-2 mt-2">
								<div
									onClick={() => {
										document.getElementById("uploadAttachments")!.click();
									}}
									className="btn btn-xs btn-outline font-normal text-white flex items-center"
								>
									<Paperclip size={16} />
									<div>Select Attachment(s)</div>
								</div>
								{!isNil(files) && files.length !== 0 && (
									<div
										className="btn btn-xs btn-outline font-normal text-white"
										onClick={() => setValue("protocolAttachments", undefined)}
									>
										Clear Current Uploads
									</div>
								)}
							</div>
							<div className="flex gap-2">
								{!isNil(files) &&
									[...Array(files?.length ?? 0).keys()].map((d) => {
										const full = files[d].name;
										const name = full.split(".")[0];
										const ext = full.split(".")[1];
										return (
											<div
												key={d}
												className="border border-gray text-gray-50 text-xs rounded-md p-1 inline-block"
											>
												{name.length > 6
													? name.slice(0, 4) + "'''" + "." + ext
													: full}
											</div>
										);
									})}
							</div>
							<input
								type="file"
								multiple
								id="uploadAttachments"
								className="hidden"
								{...register("protocolAttachments")}
							/>
						</div>
					</div>
				</div>
			</div>

			<button
				className="btn btn-primary rounded-full font-medium w-[120px] flex self-center"
				type="submit"
			>
				Post
			</button>
		</form>
	);
};

export default ProtocolForm;
