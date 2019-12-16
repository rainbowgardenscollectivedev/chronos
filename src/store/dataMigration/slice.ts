import FileSaver from "file-saver";
import { batch } from "react-redux";
import { createSlice, PayloadAction, Action } from "redux-starter-kit";
import { ThunkAction } from "redux-thunk";

import packageInfo from "../../../package.json";
import { InitDatabaseService } from "../../db";
import { actions as activityActions } from "../activity";
import { RootState } from "../index";

export interface DataMigrationState {
  exportingDatabaseRecordsError: Error | null;
  importingDatabaseRecordsError: Error | null;
  isExportingDatabaseRecords: boolean;
  isImportingDatabaseRecords: boolean;
}

const INITIAL_STATE: DataMigrationState = {
  exportingDatabaseRecordsError: null,
  importingDatabaseRecordsError: null,
  isExportingDatabaseRecords: false,
  isImportingDatabaseRecords: false
};

const dataMigration = createSlice({
  name: "dataMigration",
  initialState: INITIAL_STATE,
  reducers: {
    exportDatabaseRecordsStart(state: DataMigrationState) {
      state.isExportingDatabaseRecords = true;
    },
    exportDatabaseRecordsFailure(
      state: DataMigrationState,
      action: PayloadAction<Error>
    ) {
      state.isExportingDatabaseRecords = false;
      state.exportingDatabaseRecordsError = action.payload;
    },
    exportDatabaseRecordsSuccess(state: DataMigrationState) {
      state.isExportingDatabaseRecords = false;
      state.exportingDatabaseRecordsError = null;
    },
    importDatabaseRecordsStart(state: DataMigrationState) {
      state.isImportingDatabaseRecords = true;
    },
    importDatabaseRecordsFailure(
      state: DataMigrationState,
      action: PayloadAction<Error>
    ) {
      state.isImportingDatabaseRecords = false;
      state.importingDatabaseRecordsError = action.payload;
    },
    importDatabaseRecordsSuccess(state: DataMigrationState) {
      state.isImportingDatabaseRecords = false;
      state.importingDatabaseRecordsError = null;
    }
  }
});

const exportDatabaseRecords = (): ThunkAction<
  void,
  RootState,
  null,
  Action<string>
> => async dispatch => {
  dispatch(dataMigration.actions.exportDatabaseRecordsStart());
  try {
    const db = InitDatabaseService();
    if (db === undefined) {
      throw Error("Unable to initialize DB connection");
    }

    const data = await db.exportDatabaseRecords();
    const file = new File(
      [JSON.stringify(data)],
      `${packageInfo.name}_backup_${Date.now()}.json`,
      {
        type: "text/plain;charset=utf-8"
      }
    );
    FileSaver.saveAs(file);

    dispatch(dataMigration.actions.exportDatabaseRecordsSuccess());
  } catch (error) {
    console.error(error);
    dispatch(dataMigration.actions.exportDatabaseRecordsFailure(error));
  }
};

const importDatabaseRecords = (
  rawData: string
): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
  dispatch(dataMigration.actions.importDatabaseRecordsStart());
  try {
    const db = InitDatabaseService();
    if (db === undefined) {
      throw Error("Unable to initialize DB connection");
    }

    const data = JSON.parse(rawData);
    await db.importDatabaseRecords(data);

    batch(() => [
      dispatch(dataMigration.actions.importDatabaseRecordsSuccess()),
      dispatch(activityActions.loadRecords({ forceReload: true }))
    ]);
  } catch (error) {
    console.error(error);
    dispatch(dataMigration.actions.importDatabaseRecordsFailure(error));
  }
};

export const actions = {
  ...dataMigration.actions,
  exportDatabaseRecords,
  importDatabaseRecords
};

export const reducer = dataMigration.reducer;
