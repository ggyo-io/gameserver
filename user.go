package main

func findUserByName(name string) *User {
	var user User
	if db.Where("name = ?", name).First(&user).RecordNotFound() {
		return nil
	}
	return &user
}

func findUserByNameAndPass(name string, pass string) *User {
	hashedPass := shastr(pass)
	var user User
	if db.Where("name = ? and password = ?", name, hashedPass).First(&user).RecordNotFound() {
		return nil
	}
	return &user
}
