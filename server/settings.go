package main

func loadSettings(user string) map[string]string {
	var settings []UserSettings
	db.Where("user_id = ?", user).Find(&settings)
	m := make(map[string]string, len(settings))
	for _, s := range settings {
		m[s.Key] = s.Value
	}
	return m
}

func saveSettings(user string, settings map[string]string) {
	for k, v := range settings {
		us := UserSettings{UserID: user, Key: k}
		// update
		rows := db.Model(&us).Where("`user_id` = ? AND `key` = ?", user, k).Update("value", v).RowsAffected
		if rows == 0 {
			us.Value = v
			db.Create(&us) // create new record from newUser
		}
	}
}
