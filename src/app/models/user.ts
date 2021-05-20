export class User {
	idUser: number;
	accountStatus: string;
	userName: string;
	administrationDate: Date;
	balance: number;
	bornDate: Date;
	email: string;
	entryDate: Date;
	familyName: string;
	isEmailVerified: boolean;
	name: string;
	onlineStatus: boolean;
	password: string;
	profilePhotoUrl: string;
	role :[{
		idRole?:number,
		roleName?:string
		roleDescription?:string;
		creationDate?:Date
	}?
		
	]


	constructor(u?: User) {
		if(u != null){
		

	
			this.idUser = u.idUser;
			this.accountStatus = u.accountStatus;
			this.userName = u.userName;
			this.administrationDate = u.administrationDate;
			this.balance = u.balance;
			this.bornDate=u.bornDate;
			this.email = u.email;
			this.entryDate=u.entryDate;
			this.familyName=u.familyName;
			this.isEmailVerified = u.isEmailVerified;
			this.name = u.name;
			this.onlineStatus = u.onlineStatus;
			this.password = u.password;
			this.profilePhotoUrl = u.profilePhotoUrl;
			this.role=u.role;
		}
		
	}
}
