const mongoose = require('mongoose');
const episode = require('./episodes');
const subs = require('./subscriptions');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	lastLogin: Date,
	podcasts: [{
		podcast: subs.schema,
		episodes: [{	episode: episode.schema,
						played: Boolean
					}]
	}],
	settings: Object
},{
	timestamps: true
});

//password hash middleware - encrypting the password before it is saved into the database
userSchema.pre('save', function(next){
	const user = this;
	if(!user.isModified('password')) {return next(); }
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {return next(err);}
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) { return next(err); }
			user.password = hash;
			next();
		})
	})
})

//method for validating user's password
userSchema.methods.vaildPassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		cb(err, isMatch);
	});
};

module.exports = mongoose.model('User',userSchema);