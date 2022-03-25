function initData() {
	data =  {
		articleState: "login",
		permissions: [],
		selectedDeaddropObj: undefined,
		userObj: undefined
	};
}

var data;
initData();

function initAdminData() {
	adminData = {
		selected_user_id: undefined,
		userObjs: [],
		selectedUserObj: undefined
	};
}
var adminData;
initAdminData();
