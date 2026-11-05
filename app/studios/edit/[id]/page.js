"use client";
import { useAuth } from "components/AuthProvider";
import Protected from "components/Protected";
import { PageLoader } from "components/Skeletons";
import StudioForm from "components/StudioForm";
import { api } from "lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditStudio() {
	const { id } = useParams();
	const router = useRouter();
	const { user } = useAuth();
	const [studio, setStudio] = useState(null);

	useEffect(() => {
		api(`/studios/${id}`)
			.then((s) => {
				if (s.ownerEmail !== user.email) {
					toast.error("You can only edit your own listings.");
					router.replace("/my-listings");
				} else setStudio(s);
			})
			.catch((e) => {
				toast.error(e.message);
				router.replace("/my-listings");
			});
	}, [id, user.email, router]);

	if (!studio) return <PageLoader label="Loading your listing" />;
	return (
		<section className="section">
			<div className="container-x max-w-3xl">
				<h1 className="section-title">Update studio</h1>
				<p className="section-sub">
					Changes go live as soon as you save.
				</p>
				<div className="mt-8">
					<StudioForm
						mode="edit"
						initial={studio}
						host={{
							name: studio.ownerName,
							email: studio.ownerEmail,
						}}
					/>
				</div>
			</div>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<EditStudio />
		</Protected>
	);
}
