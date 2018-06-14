var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts){
		var tokenInstance;

	it('Initalizes the contract as the correct values',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'DappToken','has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'DAPP', 'has the corect symbol');
			return tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard,'DApp Token v1.0','has the correct standard');	
		});
	})


	it('see the total supply upon deployment',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance  = instance;
			return tokenInstance.totalSupply();

		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,'set the totalsupply 1000000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBlance){
			assert.equal(adminBlance.toNumber(),1000000,'it allocats the intial supply of admin');
		});
	});

	it('transfers token ownership', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
		  //Test 'require' staterment first by transfring somting larger then the sender blance
		  return tokenInstance.transfer.call(accounts[1],999999999999999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0,'eroor msg must contain revert');
			return tokenInstance.transfer.call(accounts[1],25000,{form:accounts[0]})
		}).then(function(success){
			assert.equal(success,true,'it returns true');
			return tokenInstance.transfer(accounts[1],250000, {form:web3.eth.accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'triggers one event');
			assert.equal(receipt.logs[0].event,'Transfer','Should be the transfer event');
			assert.equal(receipt.logs[0].args._form,accounts[0],'logs the accounts the tokens are transfer form');
			assert.equal(receipt.logs[0].args._to,accounts[1],'logs the accounts the tokens are transfer to');
			assert.equal(receipt.logs[0].args._value,250000,'logs the tranfer accounts');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250000,'adds the account to reciving accounts');
				return tokenInstance.balanceOf(accounts[0]);
				}).then(function(balance){
					assert.equal(balance.toNumber(),750000,'Deduct the some ammpunt of money');
                  });
			});


	it('approve to ammount transfer to delegated account', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1],100);
		}).then(function(success){

			assert.equal(success,true,'it returns true');
			return tokenInstance.approve(accounts[1],100, {form: accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'triggers one event');
			assert.equal(receipt.logs[0].event,'Approval','Should be the transfer event');
			assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the accounts the tokens are transfer form');
			assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the accounts the tokens are transfer to');
			assert.equal(receipt.logs[0].args._value,100,'logs the tranfer accounts');
			return tokenInstance.allowance(accounts[0],accounts[1]);
		}).then(function(allowance){
			assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
		});

		});	
it('handles delegated token transfers', function() {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function(receipt) {
      // Approve spendingAccount to spend 10 tokens form fromAccount
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function(receipt) {
      // Try transferring something larger than the sender's balance
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
      // Try transferring something larger than the approved amount
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
      }).then(function(success){
    		assert.equal(success,true);
    		return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    	}).then(function(receipt){
      console.log(receipt.logs[0])
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 90, 'detucts the amount of sending amount');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 10, 'add the amount of receiving amount');
        return tokenInstance.allowance(fromAccount,spendingAccount);
      }).then(function(allowance){
        assert.equal(allowance.toNumber(),0,'deducts the amount from the allowance');
      
    });

});  
		
})
	

	
		
