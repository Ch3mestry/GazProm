import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchNodes } from "./store/slices/nodesSlice";
import { RootState, AppDispatch } from "./store/index";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { nodes, loading, error } = useSelector(
    (state: RootState) => state.nodes
  );
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchNodes());
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const getChartData = (metrics: any[]) => ({
    labels: metrics.map((m) => m.datetime),
    datasets: [
      {
        label: "CPU",
        data: metrics.map((m) => m.cpu),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Memory",
        data: metrics.map((m) => m.memory),
        borderColor: "rgba(153,102,255,1)",
        fill: false,
      },
      {
        label: "Disk",
        data: metrics.map((m) => m.disk),
        borderColor: "rgba(255,159,64,1)",
        fill: false,
      },
    ],
  });

  return (
    <div className="table" style={{ display: "flex", gap: "40px" }}>
      <div className="first_block"></div>
      <div className="second_block">
        <h2>Список узлов:</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {nodes.map((node) => (
            <li
              key={node.id}
              style={{ display: "flex", gap: "40px", alignItems: "center" }}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <div
                style={{
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  backgroundColor: node.status.color,
                }}
              ></div>
              <p> {node.name}</p>
              <div>
                <p>{node.last_metrics.cpu}</p>
                <p>{node.last_metrics.memory}</p>
                <p>{node.last_metrics.disk}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="third_block">
        {selectedNode && (
          <div style={{ marginTop: "40px", width: "500px", height: "500px" }}>
            <h3>График метрик для {selectedNode.name}</h3>
            <Line data={getChartData(selectedNode.metrics)} />
            <h3>
              Админ: {`${selectedNode.admin.name} ${selectedNode.admin.email}`}
            </h3>
            <h3>Интерфейсы:</h3>
            <ul>
              {selectedNode.interfaces &&
                selectedNode.interfaces.map((interfaceItem) => (
                  <li key={interfaceItem.id}>{interfaceItem.name}</li>
                ))}
            </ul>
            <h3>Приложения:</h3>
            <ul>
              {selectedNode.applications.map((application) => (
                <li key={application.id}>{application.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
