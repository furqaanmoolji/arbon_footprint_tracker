import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [total, setTotal] = useState(0);

  const user_id = 1; // Hardcoded user ID for demo

  // Fetch activities and total CO₂ on load
  useEffect(() => {
    axios.get('http://localhost:5001/activities')
      .then(res => setActivities(res.data))
      .catch(err => console.error("Failed to fetch activities:", err));

    fetchTotal();
  }, []);

  const fetchTotal = () => {
    axios.get(`http://localhost:5001/logs/${user_id}`)
      .then(res => setTotal(res.data.total))
      .catch(err => console.error("Failed to fetch total CO2:", err));
  };

  const handleSubmit = () => {
    if (!selectedActivity || !quantity) return;

    axios.post('http://localhost:5001/log', {
      user_id,
      activity_id: selectedActivity,
      quantity: parseFloat(quantity)
    })
    .then(() => {
      setQuantity('');
      fetchTotal();
    })
    .catch(err => console.error("Failed to submit log:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🌱 Carbon Footprint Tracker
        </h2>

        <div className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded"
            value={selectedActivity}
            onChange={e => setSelectedActivity(e.target.value)}
          >
            <option value="" disabled>Select an Activity</option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name} ({activity.unit})
              </option>
            ))}
          </select>

          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Log Activity
          </button>

          <div className="text-center text-lg font-semibold mt-6">
            Total CO₂: <span className="text-green-700">{total || 0} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
