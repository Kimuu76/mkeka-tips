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
}) {
	// ✅ Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// ✅ Sorting state
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("Time");

	const handleSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// ✅ Sorting function
	const sortedTips = [...tips].sort((a, b) => {
		if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
		if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
		return 0;
	});

	// ✅ Paginated tips
	const paginatedTips = sortedTips.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<>
			<Table>
				<TableHead>
					<TableRow>
						{!isAdmin && <TableCell>Select</TableCell>}
						<TableCell sortDirection={orderBy === "Time" ? order : false}>
							<TableSortLabel
								active={orderBy === "Time"}
								direction={orderBy === "Time" ? order : "asc"}
								onClick={() => handleSort("Time")}
							>
								Time
							</TableSortLabel>
						</TableCell>
						<TableCell>Fixture</TableCell>
						<TableCell>Market</TableCell>
						<TableCell>Pick</TableCell>
						<TableCell>Odds</TableCell>
						{isAdmin && (
							<TableCell sortDirection={orderBy === "Status" ? order : false}>
								<TableSortLabel
									active={orderBy === "Status"}
									direction={orderBy === "Status" ? order : "asc"}
									onClick={() => handleSort("Status")}
								>
									Status
								</TableSortLabel>
							</TableCell>
						)}
						{isAdmin && (
							<TableCell sortDirection={orderBy === "Plan" ? order : false}>
								<TableSortLabel
									active={orderBy === "Plan"}
									direction={orderBy === "Plan" ? order : "asc"}
									onClick={() => handleSort("Plan")}
								>
									Plan
								</TableSortLabel>
							</TableCell>
						)}
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedTips.length === 0 ? (
						<TableRow>
							<TableCell colSpan={isAdmin ? 8 : 7} align='center'>
								No tips available
							</TableCell>
						</TableRow>
					) : (
						paginatedTips.map((tip) => {
							const isSelected = selectedTips.some((t) => t.Id === tip.Id);

							return (
								<TableRow key={tip.Id}>
									{!isAdmin && (
										<TableCell>
											<Checkbox
												checked={isSelected}
												onChange={(e) => onSelectTip(tip, e.target.checked)}
											/>
										</TableCell>
									)}
									<TableCell>{tip.Time}</TableCell>
									<TableCell>
										{tip.Home} vs {tip.Away}
									</TableCell>
									<TableCell>{tip.Market}</TableCell>
									<TableCell>{tip.Pick}</TableCell>
									<TableCell>{tip.Odds}</TableCell>
									{isAdmin && <TableCell>{tip.Status}</TableCell>}
									{isAdmin && <TableCell>{tip.Plan}</TableCell>}
									<TableCell>
										{isAdmin ? (
											<>
												<Tooltip title='Edit'>
													<IconButton
														color='primary'
														onClick={() => onEdit && onEdit(tip)}
													>
														<EditIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title='Delete'>
													<IconButton
														color='error'
														onClick={() => onDelete && onDelete(tip.Id)}
													>
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</>
										) : (
											<Button
												variant='contained'
												size='small'
												disabled={isSelected}
												onClick={() => onSelectTip(tip, true)}
											>
												{isSelected ? "Added" : "Add"}
											</Button>
										)}
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>

			{/* ✅ Pagination Controls */}
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component='div'
				count={tips.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
}
