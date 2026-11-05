"use client";
import { useAuth } from "components/AuthProvider";
import Protected from "components/Protected";
import StudioForm from "components/StudioForm";

function AddStudio() {
	const { user } = useAuth();
	return (
		<section className="section">
			<div className="container-x max-w-3xl">
				<h1 className="section-title">Add a new studio</h1>
				<p className="section-sub">
					Tell creators what makes your space special. You can edit
					everything later.
				</p>
				<div className="mt-8">
					<StudioForm
						mode="add"
						host={user}
					/>
				</div>
			</div>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<AddStudio />
		</Protected>
	);
}
