import { useEffect, useState } from "react";
import api from "../../../services/api";
import { API_BASE } from "../../../config";

const initialForm = {
  title: "",
  cover_image: "",
  description: "",
  activity_date: "",
  publish_status: true,
};

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredActivities(
      activities.filter(
        (activity) =>
          activity.title
            ?.toLowerCase()
            .includes(keyword) ||
          activity.slug
            ?.toLowerCase()
            .includes(keyword)
      )
    );
  }, [search, activities]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/activities");

      setActivities(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);

      alert("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let coverImage = form.cover_image;

      if (image) {
        const formData = new FormData();

        formData.append(
          "image",
          image
        );

        const uploadResponse =
          await api.post(
            "/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        coverImage =
          uploadResponse.data.data.url;
      }

      const payload = {
        ...form,
        cover_image: coverImage,
      };

      if (editingId) {
        await api.put(
          `/activities/${editingId}`,
          payload
        );

        alert("Activity updated");
      } else {
        await api.post(
          "/activities",
          payload
        );

        alert("Activity created");
      }

      resetForm();
      fetchActivities();

    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (activity) => {
    setEditingId(activity.id);

    setForm({
      title: activity.title || "",
      cover_image:
        activity.cover_image || "",
      description:
        activity.description || "",
      activity_date:
        activity.activity_date
          ?.split("T")[0] || "",
      publish_status:
        activity.publish_status,
    });

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete activity?"
      )
    )
      return;

    try {
      await api.delete(
        `/activities/${id}`
      );

      fetchActivities();

      alert("Activity deleted");
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Activity Management
        </h1>

        <p className="text-slate-500">
          Manage NGO activities
        </p>
      </div>

      {/* Form */}

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            {editingId
              ? "Update Activity"
              : "Create Activity"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />

            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-32 h-20 mt-3 rounded object-cover border"
              />
            ) : form.cover_image ? (
              <img
                src={
                  form.cover_image?.startsWith("/uploads")
                    ? `${API_BASE}${form.cover_image}`
                    : `${API_BASE}/uploads/${form.cover_image}`
                }
                alt="Preview"
                className="w-32 h-20 mt-3 rounded object-cover border"
              />
            ) : null}

          </div>

          <input
            type="date"
            value={form.activity_date}
            onChange={(e) =>
              setForm({
                ...form,
                activity_date:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            value={form.publish_status}
            onChange={(e) =>
              setForm({
                ...form,
                publish_status:
                  e.target.value === "true",
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value={true}>
              Published
            </option>

            <option value={false}>
              Draft
            </option>
          </select>

          <textarea
            rows="5"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Activity"
                : "Create Activity"}
          </button>

        </form>

      </div>

      {/* Table */}

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            Activities
          </h2>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border rounded-lg px-3 py-2"
            />

            <button
              type="button"
              onClick={fetchActivities}
              className="bg-slate-700 text-white px-4 py-2 rounded"
            >
              Refresh
            </button>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead>
              <tr className="bg-slate-100">
                <th className="border p-3">
                  Image
                </th>

                <th className="border p-3">
                  Title
                </th>

                <th className="border p-3">
                  Date
                </th>

                <th className="border p-3">
                  Status
                </th>

                <th className="border p-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredActivities.length >
                0 ? (
                filteredActivities.map(
                  (activity) => (
                    <tr
                      key={activity.id}
                    >
                      <td className="border p-3">

                        {activity.cover_image ? (
                          <img
                            src={
                              activity.cover_image?.startsWith("/uploads")
                                ? `${API_BASE}${activity.cover_image}`
                                : `${API_BASE}/uploads/${activity.cover_image}`
                            }
                            alt={activity.title}
                            className="w-20 h-14 object-cover rounded"
                          />
                        ) : (
                          "-"
                        )}

                      </td>

                      <td className="border p-3">
                        {activity.title}
                      </td>

                      <td className="border p-3">
                        {activity.activity_date
                          ? new Date(
                            activity.activity_date
                          ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="border p-3">

                        <span
                          className={`px-2 py-1 rounded text-xs ${activity.publish_status
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {activity.publish_status
                            ? "Published"
                            : "Draft"}
                        </span>

                      </td>

                      <td className="border p-3">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(
                                activity
                              )
                            }
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                activity.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>

                        </div>

                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6"
                  >
                    No activities found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ActivityManagement;