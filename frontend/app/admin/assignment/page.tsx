"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Filter, Upload, CheckCircle, BookOpen, Edit3, Calendar } from "lucide-react"

// Mock data for assignments
const mockAssignments = [
	{
		id: 1,
		student: "Alice Lee",
		title: "Alphabet Worksheet",
		description: "Practice writing lowercase letters.",
		dueDate: "2025-08-25",
		file: "worksheet-week12.pdf",
		answer: "Uploaded PDF",
		feedback: "",
		recommended: "",
	},
	{
		id: 2,
		student: "Ben Chan",
		title: "Phonics Exercise",
		description: "Complete sound matching activity.",
		dueDate: "2025-08-26",
		file: "worksheet-week12.pdf",
		answer: "Uploaded JPG",
		feedback: "",
		recommended: "",
	},
]

const mockStudents = ["All", "Alice Lee", "Ben Chan"]

export default function AdminUploadAssignmentPage() {
	const [file, setFile] = useState<File | null>(null)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [dueDate, setDueDate] = useState("")
	const [uploading, setUploading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [assignments, setAssignments] = useState(mockAssignments)
	const [selectedStudent, setSelectedStudent] = useState("All")

	// Upload handler
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files?.[0] || null)
		setSuccess(false)
	}

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!file || !title || !description || !dueDate) return
		setUploading(true)
		setTimeout(() => {
			setUploading(false)
			setSuccess(true)
			setAssignments([
				...assignments,
				{
					id: assignments.length + 1,
					student: "Alice Lee", // Replace with selected student if needed
					title,
					description,
					dueDate,
					file: file.name,
					answer: "Uploaded file",
					feedback: "",
					recommended: "",
				},
			])
			setFile(null)
			setTitle("")
			setDescription("")
			setDueDate("")
		}, 1500)
	}

	// Filter assignments
	const filteredAssignments =
		selectedStudent === "All"
			? assignments
			: assignments.filter((a) => a.student === selectedStudent)

	// Feedback handler
	const handleFeedbackChange = (id: number, value: string) => {
		setAssignments(
			assignments.map((a) => (a.id === id ? { ...a, feedback: value } : a))
		)
	}

	// Recommended learning handler
	const handleRecommendedChange = (id: number, value: string) => {
		setAssignments(
			assignments.map((a) => (a.id === id ? { ...a, recommended: value } : a))
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mb-8">
				<h2 className="text-3xl font-bold text-black text-center tracking-tight mb-2">
					Upload Assignment
				</h2>
				<div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4"></div>
				<form onSubmit={handleUpload} className="space-y-4">
					<Input
						type="text"
						placeholder="Assignment Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<Textarea
						placeholder="Assignment Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<Input
						type="date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						required
					/>
					<Input
						type="file"
						accept=".pdf,.doc,.docx,.jpg,.png"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-700"
						required
					/>
					<Button
						type="submit"
						disabled={
							!file ||
							uploading ||
							!title ||
							!description ||
							!dueDate
						}
						className="w-full"
					>
						<Upload className="w-4 h-4 mr-2" />
						{uploading ? "Uploading..." : "Upload"}
					</Button>
					{success && (
						<div className="text-green-600 text-center mt-2">
							Assignment uploaded successfully!
						</div>
					)}
				</form>
			</div>

			<div className="w-full max-w-2xl">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-3xl font-bold text-black tracking-tight">
						View Assignments
					</h2>
					<div className="w-16 h-1 bg-primary rounded-full"></div>
				</div>
				<div className="flex items-center gap-2 mb-6">
					<Filter className="w-4 h-4 text-gray-600" />
					<select
						value={selectedStudent}
						onChange={(e) => setSelectedStudent(e.target.value)}
						className="border rounded-lg px-3 py-1 text-gray-700"
					>
						{mockStudents.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				<div className="space-y-6">
					{filteredAssignments.map((a) => (
						<Card
							key={a.id}
							className="bg-white border border-gray-200 shadow-sm"
						>
							<CardContent className="p-5 space-y-3">
								<div className="flex items-center gap-3">
									<Badge className="bg-blue-100 text-blue-700">
										{a.student}
									</Badge>
									<span className="text-sm text-gray-500">{a.file}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-semibold text-lg">{a.title}</span>
								</div>
								<div className="text-gray-700 text-sm mb-1">
									{a.description}
								</div>
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="w-4 h-4 text-gray-500" />
									<span className="text-xs text-gray-500">
										Due: {a.dueDate}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="w-4 h-4 text-green-600" />
									<span className="text-sm text-gray-700">
										Answer: {a.answer}
									</span>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Provide Feedback
									</label>
									<Textarea
										value={a.feedback}
										onChange={(e) =>
											handleFeedbackChange(a.id, e.target.value)
										}
										placeholder="Type feedback here..."
										className="w-full"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Assign Recommended Learnings
									</label>
									<Textarea
										value={a.recommended}
										onChange={(e) =>
											handleRecommendedChange(a.id, e.target.value)
										}
										placeholder="E.g. Sight words, phonics, etc."
										className="w-full"
									/>
								</div>
								<div className="flex gap-2 mt-2">
									<Button
										variant="outline"
										className="text-green-600 border-green-200"
									>
										<Edit3 className="w-4 h-4 mr-2" />
										Save Feedback
									</Button>
									<Button
										variant="outline"
										className="text-blue-600 border-blue-200"
									>
										<BookOpen className="w-4 h-4 mr-2" />
										Assign Learning
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
					{filteredAssignments.length === 0 && (
						<div className="text-center text-gray-500 py-8">
							No assignments found for this student.
						</div>
					)}
				</div>
			</div>
			<div className="h-20"></div>
		</div>
	)
}