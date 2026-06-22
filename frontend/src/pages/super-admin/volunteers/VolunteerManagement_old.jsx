import { useEffect, useState } from "react";
import api from "../../../services/api";

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/volunteers");

      setVolunteers(response.data.data || []);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to load volunteers"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveVolunteer = async (id) => {
    try {
      await api.put(`/volunteers/${id}/approve`);

      fetchVolunteers();

      alert("Volunteer approved");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Approval failed"
      );
    }
  };

  const rejectVolunteer = async (id) => {
    try {
      await api.put(`/volunteers/${id}/reject`);

      fetchVolunteers();

      alert("Volunteer rejected");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Reject failed"
      );
    }
  };

  const deleteVolunteer = async (id) => {
    const confirmed = window.confirm(
      "Delete volunteer permanently?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/volunteers/${id}`);

      fetchVolunteers();

      alert("Volunteer deleted");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Volunteer Management
        </h1>

        <p className="text-slate-500 mt-1">
          Manage volunteer applications
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Volunteers
          </h2>

          <button
            onClick={fetchVolunteers}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border">

              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Photo</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Mobile</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Volunteer ID</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>

              <tbody>

                {volunteers.length > 0 ? (
                  volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>

                      <td className="border p-3">
                        {volunteer.id}
                      </td>

                      <td className="border p-3">

                        {volunteer.photo ? (
                          <img
                            src={volunteer.photo}
                            alt={volunteer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          "-"
                        )}

                      </td>

                      <td className="border p-3">
                        {volunteer.name}
                      </td>

                      <td className="border p-3">
                        {volunteer.mobile}
                      </td>

                      <td className="border p-3">
                        {volunteer.email}
                      </td>

                      <td className="border p-3">
                        {volunteer.volunteer_id || "-"}
                      </td>

                      <td className="border p-3">

                        {volunteer.status === "approved" && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            Approved
                          </span>
                        )}

                        {volunteer.status === "pending" && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                            Pending
                          </span>
                        )}

                        {volunteer.status === "rejected" && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                            Rejected
                          </span>
                        )}

                      </td>

                      <td className="border p-3">

                        <div className="flex gap-2 flex-wrap">

                          {volunteer.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  approveVolunteer(
                                    volunteer.id
                                  )
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  rejectVolunteer(
                                    volunteer.id
                                  )
                                }
                                className="bg-orange-500 text-white px-3 py-1 rounded"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              deleteVolunteer(
                                volunteer.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center p-6"
                    >
                      No volunteers found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default VolunteerManagement;