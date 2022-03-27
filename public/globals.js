const SYS_LOGIN = "SYS_LOGIN";
const SYS_ADMINISTRATOR = "SYS_ADMINISTRATOR";
const SYS_TAGS = "SYSTEM DEADDROP MAILDROP";
const SYS_TAGS_SYSTEM = "SYSTEM";
const SYS_TAGS_DEADDROP = "DEADDROP";
const SYS_TAGS_MAILDROP = "MAILDROP";
const SYS_DETAILS_ALL = "CREATE READ UPDATE DELETE";
const DEADDROP_ADMIN = "DEADDROP_ADMIN";
const SYS_DETAILS_CREATE = "CREATE";
const SYS_DETAILS_READ = "READ";
const SYS_DETAILS_UPDATE = "UPDATE";
const SYS_DETAILS_DELETE = "DELETE";

function initData() {
	data = {
		articleState: "login",
		permissions: [],
		selected_deaddrop_id: undefined,
		userObj: undefined,
		selected_user_id: undefined
	};
}

var data;
initData();

