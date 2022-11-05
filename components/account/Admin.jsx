import { Box, Button, Checkbox, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../utils/api";

const Admin = ({ multiAccount, newMultiAccount, setNewMultiAccount }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [gridRows, setGridRows] = useState([]);
  const [updatedGridRows, setUpdatedGridRows] = useState([]);
  const [gridColumns, setGridColumns] = useState([]);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  const [onlyUpdatedGridRows, setOnlyUpdatedGridRows] = useState([]);

  useEffect(() => {
    const onlyUpdatedGridRows = updatedGridRows.filter(
      (a) => !gridRows.map((b) => JSON.stringify(b)).includes(JSON.stringify(a))
    );
    if (onlyUpdatedGridRows.length > 0) {
      setOnlyUpdatedGridRows(onlyUpdatedGridRows);
    } else {
      setOnlyUpdatedGridRows([]);
    }
  }, [updatedGridRows]);

  useEffect(() => {
    setUpdatedGridRows(gridRows);
  }, [gridRows]);

  useEffect(() => {
    let active = true;

    fetchUsers(active, page);

    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => {
    if (allUsers.length === 0) return;
    const columns = [];
    const rows = [];
    Object.entries(allUsers[0]).forEach(([key, value]) => {
      columns.push({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        type: typeof value,
        editable: key !== "id" && key !== "admin" ? true : false,
        flex: key !== "id" ? 1 : 0.4,
      });
    });
    setGridColumns(columns);
    allUsers.forEach((user) => {
      rows.push(user);
    });
    setGridRows(rows);
  }, [allUsers]);

  const fetchUsers = async (active, page) => {
    setLoading(true);
    try {
      const resp = await api.fetch(`admin/get-users?page=${page}`);
      if (!active) return;
      setRowCount(parseInt(resp.rowCount));
      setAllUsers(resp.users);
    } catch (e) {
      console.error(e);
      toast.error("Failed to retreive users");
    }
    setLoading(false);
  };

  const deleteSelectedUsers = async () => {
    const deleteRequest = api.fetch("admin/delete-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        users: selectionModel.map((userId) => ({
          id: userId,
        })),
      }),
    });

    await toast.promise(deleteRequest, {
      pending: "Supression en cours..",
      success: "Utilisateurs suprimés!",
      error: {
        render({ data }) {
          console.error(data);
          return "Une erreur est survenue";
        },
      },
    });

    fetchUsers(true, page);
  };

  const handleSave = async () => {
    const apiCall = api.fetch("admin/update-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        users: onlyUpdatedGridRows,
      }),
    });

    await toast.promise(apiCall, {
      pending: "Mis a jour en cours..",
      success: "Donnée mise à jour!",
      error: {
        render({ data }) {
          console.error(data);
          return "Une erreur est survenue";
        },
      },
    });

    fetchUsers(true, page);
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "300",
        }}
      >
        Espace admin
      </Typography>
      <Stack
        sx={{
          gap: ".5rem",
        }}
      >
        <Typography component="h3" variant="h5">
          Plusieurs compte utilisateur
        </Typography>
        <Typography component="p" color="orange">
          Désactivé par défaut pour éviter les bans ip du serveur
        </Typography>
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={newMultiAccount}
            onChange={(e) => {
              if (e.target.checked) {
                setNewMultiAccount(true);
              } else {
                setNewMultiAccount(false);
              }
            }}
          />
          <Typography color={multiAccount !== newMultiAccount ? "orange" : ""}>
            Multi compte
          </Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          gap: ".5rem",
        }}
      >
        <Typography component="h3" variant="h5">
          Utilisateurs de la plateforme
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            disabled={onlyUpdatedGridRows.length > 0 ? false : true}
            onClick={() => {
              setUpdatedGridRows(gridRows);
            }}
          >
            Annuler
          </Button>
          <Button
            disabled={selectionModel.length > 0 ? false : true}
            color={"error"}
            onClick={deleteSelectedUsers}
          >
            Supprimer
          </Button>
          <Button
            disabled={onlyUpdatedGridRows.length > 0 ? false : true}
            color={"success"}
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={updatedGridRows}
            columns={gridColumns}
            editMode="row"
            processRowUpdate={(updatedRow) => {
              const updatedRowFormatted = { ...updatedRow, isNew: false };
              setUpdatedGridRows(
                updatedGridRows.map((row) => {
                  if (row.id === updatedRow.id) {
                    return updatedRow;
                  } else {
                    return row;
                  }
                })
              );
              return updatedRowFormatted;
            }}
            onProcessRowUpdateError={(e) => {
              console.error(e);
            }}
            experimentalFeatures={{ newEditingApi: true }}
            getRowClassName={(params) => {
              if (params.row.admin) {
                return "row-disabled";
              }
            }}
            isCellEditable={(params) => {
              if (params.row.admin) {
                return false;
              }
              return true;
            }}
            isRowSelectable={(params) => {
              if (params.row.admin) {
                return false;
              }
              return true;
            }}
            checkboxSelection
            disableSelectionOnClick
            keepNonExistentRowsSelected
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            pageSize={5}
            rowCount={rowCount}
            rowsPerPageOptions={[5]}
            paginationMode="server"
            pagination
            onPageChange={(newPage) => {
              setPage(newPage);
            }}
            loading={loading}
          />
        </div>
      </Stack>
    </>
  );
};

export default Admin;
