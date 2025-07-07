import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export function DriverSchedulingSection({ driverId }: { driverId: string }) {
	const [availability, setAvailability] = useState<Database["public"]["Tables"]["driver_availability"]["Row"][]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (driverId) {
    fetchAvailability();
  }
		// eslint-disable-next-line
	}, [driverId]);

	const fetchAvailability = async () => {
		setLoading(true);
		setError(null);
		try {
			const { data, error } = await supabase
				.from("driver_availability")
				.select("*")
				.eq("driver_id", driverId);
			if (error) {
     throw error;
   }
			setAvailability(data || []);
		} catch (err) {
			setError("Failed to load availability");
		} finally {
			setLoading(false);
		}
	};

	const handleTimeChange = (
		dayIdx: number,
		field: "start_time" | "end_time",
		value: string
	) => {
		setAvailability((prev) => {
			const copy = [...prev];
			let entry = copy.find((a) => a.day_of_week === dayIdx);
			if (!entry) {
				entry = {
					id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
					day_of_week: dayIdx,
					start_time: "09:00",
					end_time: "17:00",
					driver_id: driverId,
				};
				copy.push(entry);
			}
			entry[field] = value;
			return copy;
		});
	};

	const handleSave = async () => {
		setSaving(true);
		setError(null);
		try {
			// Upsert all days
			for (const entry of availability) {
				await supabase.from("driver_availability").upsert({
					driver_id: driverId,
					day_of_week: entry.day_of_week,
					start_time: entry.start_time,
					end_time: entry.end_time,
				});
			}
		} catch (err) {
			setError("Failed to save availability");
		} finally {
			setSaving(false);
			fetchAvailability();
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Weekly Availability</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div>Loading...</div>
				) : (
					<form className="space-y-4">
						{DAYS.map((day, idx) => {
							const entry =
								availability.find((a) => a.day_of_week === idx) || {
									id: "",
									day_of_week: idx,
									start_time: "09:00",
									end_time: "17:00",
									driver_id: driverId,
								};
							return (
								<div key={day} className="flex items-center gap-4">
									<span className="w-24">{day}</span>
									<input
										type="time"
										value={entry.start_time || "09:00"}
										onChange={(e) =>
											handleTimeChange(idx, "start_time", e.target.value)
										}
										className="border rounded px-2 py-1"
									/>
									<span>-</span>
									<input
										type="time"
										value={entry.end_time || "17:00"}
										onChange={(e) =>
											handleTimeChange(idx, "end_time", e.target.value)
										}
										className="border rounded px-2 py-1"
									/>
								</div>
							);
						})}
						<Button
							type="button"
							onClick={handleSave}
							disabled={saving}
							className="mt-2"
						>
							{saving ? "Saving..." : "Save Availability"}
						</Button>
						{error && (
							<div className="text-red-500 mt-2">
								{error}
							</div>
						)}
					</form>
				)}
			</CardContent>
		</Card>
	);
}
