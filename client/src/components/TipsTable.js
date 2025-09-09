/** @format */
import React, { useState } from "react";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Checkbox,
	Button,
	IconButton,
	Tooltip,
	TablePagination,
	TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TipsTable({
	tips = [],
	onSelectTip,
	selectedTips = [],
	isAdmin = false,
	onEdit,
	onDelete,
	sectionType = "today", // ✅ new prop: "today" or "results"
}) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("");

	const handleSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// ✅ Sort tips
	let sortedTips = [...tips].sort((a, b) => {
		const dateA = new Date(a.Date);
		const dateB = new Date(b.Date);
		if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;

		const [hourA, minuteA] = (a.Time || "00:00").split(":").map(Number);
		const [hourB, minuteB] = (b.Time || "00:00").split(":").map(Number);
		return hourA - hourB || minuteA - minuteB;
	});

	if (orderBy) {
		sortedTips = sortedTips.sort((a, b) => {
			if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
			if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
			return 0;
		});
	}

	// ✅ Apply filtering for clients based on sectionType
	if (!isAdmin) {
		if (sectionType === "today") {
			// Show only Pending tips for Today section
			sortedTips = sortedTips.filter((tip) => tip.Status === "Pending");
		} else if (sectionType === "results") {
			// Show only Won/Lost tips for Recent Results
			sortedTips = sortedTips.filter(
				(tip) => tip.Status === "Won" || tip.Status === "Lost"
			);
		}
	}

	// ✅ Group by Day
	let flattenedList = [];
	let currentDay = "";
	sortedTips.forEach((tip) => {
		const dayLabel = tip.Day || tip.Date;
		if (dayLabel !== currentDay) {
			flattenedList.push({ type: "header", dayLabel });
			currentDay = dayLabel;
		}
		flattenedList.push({ type: "tip", ...tip });
	});

	// ✅ Pagination
	const paginatedList = flattenedList.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<>
			<Table>
				<TableHead>
					<TableRow>
						{!isAdmin && sectionType === "today" && (
							<TableCell>Select</TableCell>
						)}
						<TableCell>
							<TableSortLabel
								active={orderBy === "Time"}
								direction={orderBy === "Time" ? order : "asc"}
								onClick={() => handleSort("Time")}
							>
								Time
							</TableSortLabel>
						</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Fixture</TableCell>
						<TableCell>Market</TableCell>
						<TableCell>Pick</TableCell>
						<TableCell>Odds</TableCell>
						{isAdmin && <TableCell>Status</TableCell>}
						{isAdmin && <TableCell>Plan</TableCell>}
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedTips.length === 0 ? (
						<TableRow>
							<TableCell colSpan={isAdmin ? 9 : 8} align='center'>
								No tips available
							</TableCell>
						</TableRow>
					) : (
						paginatedList.map((item, index) =>
							item.type === "header" ? (
								<TableRow
									key={`header-${index}`}
									style={{ background: "#f0f0f0" }}
								>
									<TableCell
										colSpan={isAdmin ? 9 : 8}
										style={{ fontWeight: "bold" }}
									>
										{item.dayLabel}
									</TableCell>
								</TableRow>
							) : (
								<TableRow key={item.Id}>
									{!isAdmin && sectionType === "today" && (
										<TableCell>
											<Checkbox
												checked={selectedTips.some((t) => t.Id === item.Id)}
												onChange={(e) => onSelectTip(item, e.target.checked)}
											/>
										</TableCell>
									)}
									<TableCell>{item.Time}</TableCell>
									<TableCell>{item.Date}</TableCell>
									<TableCell>
										{item.Home} vs {item.Away}
									</TableCell>
									<TableCell>{item.Market}</TableCell>
									<TableCell>{item.Pick}</TableCell>
									<TableCell>{item.Odds}</TableCell>
									{isAdmin && <TableCell>{item.Status}</TableCell>}
									{isAdmin && <TableCell>{item.Plan}</TableCell>}
									<TableCell>
										{isAdmin ? (
											<>
												<Tooltip title='Edit'>
													<IconButton
														color='primary'
														onClick={() => onEdit(item)}
													>
														<EditIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title='Delete'>
													<IconButton
														color='error'
														onClick={() => onDelete(item.Id)}
													>
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</>
										) : (
											sectionType === "today" && (
												<Button
													variant='contained'
													size='small'
													disabled={selectedTips.some((t) => t.Id === item.Id)}
													onClick={() => onSelectTip(item, true)}
												>
													{selectedTips.some((t) => t.Id === item.Id)
														? "Added"
														: "Add"}
												</Button>
											)
										)}
									</TableCell>
								</TableRow>
							)
						)
					)}
				</TableBody>
			</Table>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component='div'
				count={flattenedList.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
}
