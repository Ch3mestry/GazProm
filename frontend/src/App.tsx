import styles from "./App.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchNodes } from "./store/slices/nodesSlice";
import { fetchGroups } from "./store/slices/groupsSlice";
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
  const { groups } = useSelector((state: RootState) => state.groups);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchNodes());
      dispatch(fetchGroups());
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const filteredNodes =
    selectedGroupId !== null
      ? nodes.filter((node) =>
          node.groups.some((group) => group.id === selectedGroupId)
        )
      : nodes;

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
    <main className={styles.main_content}>
      <div className={styles.node_table}>
        <div className={styles.first_col}>
          <div className="general_info">
            <span>Всего узлов: {nodes.length}</span>
          </div>
          <ul className={styles.group_list}>
            <button
              className={styles.group_item}
              onClick={() => setSelectedGroupId(null)}
            >
              Показать все
            </button>
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  className={styles.group_item}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  {group.caption}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.second_col}>
          <h2 className={styles.second_col_title}>Список узлов:</h2>
          <ul className={styles.node_list}>
            {filteredNodes.map((node) => (
              <li
                key={node.id}
                className={styles.node_item}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div
                  className={styles.status_circle}
                  style={{ backgroundColor: node.status.color }}
                ></div>
                <p> {node.name}</p>
                <div className={styles.node_characteristics}>
                  <span>cpu: {node.last_metrics.cpu}</span>
                  <span>mem: {node.last_metrics.memory}</span>
                  <span>disk: {node.last_metrics.disk}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.third_col}>
          {selectedNode && (
            <div className={styles.node_info}>
              <h3>График метрик для {selectedNode.name}</h3>
              <Line data={getChartData(selectedNode.metrics)} />
              <h3>
                Админ:
                {`${selectedNode.admin.name} ${selectedNode.admin.email}`}
              </h3>
              <h3>Интерфейс:</h3>
              {selectedNode.interfaces.name ? (
                <div className={styles.interface_info}>
                  <div
                    className={styles.status_circle}
                    style={{ backgroundColor: selectedNode.status.color }}
                  ></div>
                  <span>{selectedNode.interfaces.name}</span>
                </div>
              ) : (
                <span>Интерфейс не определен</span>
              )}
              <h3>Приложения:</h3>
              <ul className={styles.node_applications}>
                {selectedNode.applications.length > 0 ? (
                  selectedNode.applications.map((application) => (
                    <li
                      className={styles.node_application}
                      key={application.id}
                    >
                      {application.name}
                    </li>
                  ))
                ) : (
                  <span>Запущенных приложений не обнаружено</span>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
