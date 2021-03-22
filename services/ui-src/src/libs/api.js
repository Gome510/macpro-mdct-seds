import { API } from "aws-amplify";

const requestOptions = () => {
  return {};
};

export const exportToExcel = async () => {
  const opts = requestOptions();

  return API.post("amendments", "/users/export-to-excel", opts);
};

export function listAmendments() {
  const opts = requestOptions();
  return API.get("amendments", "/amendments", opts);
}

export function getAmendment(id) {
  const opts = requestOptions();
  return API.get("amendments", `/amendments/${id}`, opts);
}

export function createAmendment(body) {
  const opts = requestOptions();
  opts.body = body;
  return API.post("amendments", "/amendments", opts);
}

export function updateAmendment(id, body) {
  const opts = requestOptions();
  opts.body = body;
  return API.put("amendments", `/amendments/${id}`, opts);
}

export function deleteAmendment(id) {
  const opts = requestOptions();
  return API.del("amendments", `/amendments/${id}`, opts);
}

export function listUsers() {
  const opts = requestOptions();
  return API.get("amendments", `/users`, opts);
}

export function activateDeactivateUser(data) {
  const opts = requestOptions();
  opts.body = data;
  return API.post("amendments", `/users/activation/${data.username}`, opts);
}

export function getUserById(data) {
  const opts = requestOptions();
  return API.get("amendments", `/users/${data.userId}`, opts);
}

export function getUserByUsername(data) {
  // console.log("zzzGetUesrByUserName");
  const opts = requestOptions();
  opts.body = data;
  // console.log("zzzGetUesrByUserName opts", opts);
  return API.post("amendments", `/users/get`, opts);
}

export function updateUser(data) {
  const opts = requestOptions();
  opts.body = data;
  return API.post("amendments", `/users/update/${data.userId}`, opts);
}

export function createUser(data) {
  const opts = requestOptions();
  opts.body = data;
  return API.post("amendments", `/users/add`, opts);
}

export function getStateForms(stateId, specifiedYear, quarter) {
  const opts = requestOptions();
  return API.get(
    "amendments",
    `/forms/${stateId}/${specifiedYear}/${quarter}`,
    opts
  );
}

export function getSingleForm(state, specifiedYear, quarter, form) {
  const opts = requestOptions();
  return API.get(
    "amendments",
    `/single-form/${state}/${specifiedYear}/${quarter}/${form}`,
    opts
  );
}

export function getFormTypes() {
  const opts = requestOptions();
  return API.get("amendments", "/form-types", opts);
}
