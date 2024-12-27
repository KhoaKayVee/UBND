"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  db,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "../firebase";

interface Project {
  id: string; // Không còn dấu `?`, đảm bảo `id` luôn tồn tại
  name: string;
  address: string;
  description: string;
  status: string;
  progress: number;
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    address: "",
    description: "",
    status: "Mới bắt đầu",
    progress: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrEditProject = async () => {
    if (!newProject.name || !newProject.address || !newProject.description) {
      alert("Tất cả các trường là bắt buộc.");
      return;
    }

    if (editMode && editingProjectId) {
      const projectRef = doc(db, "projects", editingProjectId);
      await updateDoc(projectRef, newProject);
    } else {
      await addDoc(collection(db, "projects"), newProject);
    }

    setEditMode(false);
    setEditingProjectId(null);
    setNewProject({
      name: "",
      address: "",
      description: "",
      status: "Mới bắt đầu",
      progress: 0,
    });
  };

  const handleDeleteProject = async (id: string) => {
    const projectRef = doc(db, "projects", id);
    await deleteDoc(projectRef);
  };

  const handleEditProject = (id: string) => {
    const projectToEdit = projects.find((project) => project.id === id);

    if (!projectToEdit) {
      alert("Không tìm thấy công trình để chỉnh sửa!");
      return;
    }

    setNewProject({
      name: projectToEdit.name,
      address: projectToEdit.address,
      description: projectToEdit.description,
      status: projectToEdit.status,
      progress: projectToEdit.progress,
    });
    setEditMode(true);
    setEditingProjectId(id);
    setShowModal(true);
  };

  const getStatusClass = (status: string) => {
    if (status === "Đang thực hiện") return "bg-yellow-300";
    if (status === "Hoàn thành") return "bg-green-300";
    if (status === "Mới bắt đầu") return "bg-red-300";
    return "";
  };

  const filteredAndSortedProjects = projects
    .filter((project) =>
      filterStatus ? project.status === filterStatus : true
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      return 0;
    });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 min-h-screen text-white">
      <Head>
        <title>Dân Vận Khéo 2025</title>
        <meta
          name="description"
          content="Website hỗ trợ thực hiện mô hình 'Dân Vận Khéo' cấp quận."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-700 py-4 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Dân Vận Khéo 2025</h1>
          <ul className="flex space-x-6">
            <li>
              <Link href="#projects" legacyBehavior>
                <a className="hover:underline">Công Trình</a>
              </Link>
            </li>
            <li>
              <Link href="#guidelines" legacyBehavior>
                <a className="hover:underline">Hướng Dẫn</a>
              </Link>
            </li>
            <li>
              <Link href="#assignments" legacyBehavior>
                <a className="hover:underline">Phân Công</a>
              </Link>
            </li>
            <li>
              <Link href="#statistics" legacyBehavior>
                <a className="hover:underline">Thống Kê</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section id="projects" className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Danh Sách Công Trình</h2>
          <div className="mb-6 flex justify-between items-center text-black">
            <div>
              <label htmlFor="filterStatus" className="mr-2 font-semibold">
                Lọc theo trạng thái:
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Tất cả</option>
                <option value="Mới bắt đầu">Mới bắt đầu</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="mr-2 font-semibold">
                Sắp xếp theo:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="name">Tên</option>
                <option value="progress">Tiến độ</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mb-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all shadow-lg"
          >
            + Thêm Công Trình
          </button>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedProjects.map((project) => (
              <li
                key={project.id}
                className={`p-4 text-black rounded-lg shadow-lg ${getStatusClass(
                  project.status
                )}`}
              >
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                <p>Địa chỉ: {project.address}</p>
                <p>Mô tả: {project.description}</p>
                <p>Trạng thái: {project.status}</p>
                <p>Tiến độ: {project.progress}%</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black p-8 rounded-lg shadow-2xl w-96 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-4 text-center">
                {editMode ? "Chỉnh Sửa Công Trình" : "Thêm Công Trình Mới"}
              </h3>
              <input
                type="text"
                placeholder="Tên dự án"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                value={newProject.address}
                onChange={(e) =>
                  setNewProject({ ...newProject, address: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Mô tả"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mới bắt đầu">Mới bắt đầu</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <input
                type="number"
                placeholder="Tiến độ (%)"
                value={newProject.progress}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    progress: parseInt(e.target.value),
                  })
                }
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddOrEditProject}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {editMode ? "Lưu" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 border-t border-white mt-8">
        <p>&copy; 2025 UBND Phường 13, Quận 4. All rights reserved.</p>
      </footer>
    </div>
  );
}
