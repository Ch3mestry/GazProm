SELECT
  n.id,
  n.caption AS name,
  s.color AS status_color,
  s.description AS status_description,
  json_group_array (
    DISTINCT json_object ('id', g.id, 'name', g.caption)
  ) AS groups,
  json_group_array (
    DISTINCT json_object ('id', a.id, 'name', a.caption)
  ) AS applications,
  CASE
    WHEN n.interface IS NOT NULL THEN json_object (
      'id',
      i.id,
      'name',
      i.caption,
      'status',
      st.color,
      'status_description',
      st.description
    )
    ELSE '{}'
  END AS interfaces,
  json_object (
    'id',
    u.id,
    'name',
    u.firstname || ' ' || u.lastname,
    'email',
    u.email
  ) AS admin,
  (
    SELECT
      json_group_array (
        json_object (
          'datetime',
          datetime,
          'cpu',
          cpu_utilization,
          'memory',
          memory_utilization,
          'disk',
          disk_utilization
        )
      )
    FROM
      metrics
    WHERE
      node_id = n.id
    ORDER BY
      datetime DESC
    LIMIT
      24
  ) AS metrics
FROM
  nodes n
  LEFT JOIN groups_nodes gn ON n.id = gn.node_id
  LEFT JOIN groups g ON gn.group_id = g.id
  LEFT JOIN nodes_applications na ON n.id = na.node_id
  LEFT JOIN applications a ON na.application_id = a.id
  LEFT JOIN statuses s ON n.status = s.id
  LEFT JOIN users u ON n.admin = u.id
  LEFT JOIN interfaces i ON n.interface = i.id
  LEFT JOIN statuses st ON i.status = st.id
GROUP BY
  n.id;