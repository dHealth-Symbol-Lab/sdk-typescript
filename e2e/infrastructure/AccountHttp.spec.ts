/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {deepEqual} from 'assert';
import {assert, expect} from 'chai';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import { Account } from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PropertyModificationType } from '../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../src/model/account/PropertyType';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AccountPropertyModification } from '../../src/model/transaction/AccountPropertyModification';
import { AccountPropertyTransaction } from '../../src/model/transaction/AccountPropertyTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';

describe('AccountHttp', () => {
    let account: Account;
    let account2: Account;
    let account3: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let accountAddress: Address;
    let accountPublicKey: string;
    let publicAccount: PublicAccount;
    let accountHttp: AccountHttp;
    let transactionHttp: TransactionHttp;
    let config;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            account3 = Account.createFromPrivateKey(json.testAccount3.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            accountAddress = Address.createFromRawAddress(json.testAccount.address);
            accountPublicKey = json.testAccount.publicKey;
            publicAccount = PublicAccount.createFromPublicKey(json.testAccount.publicKey, NetworkType.MIJIN_TEST);

            accountHttp = new AccountHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            done();
        });
    });
    describe('TransferTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('getAccountInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountInfo(accountAddress)
                .subscribe((accountInfo) => {
                    expect(accountInfo.publicKey).to.be.equal(accountPublicKey);
                    done();
                });
        });
    });

    describe('getAccountsInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountsInfo([accountAddress])
                .subscribe((accountsInfo) => {
                    expect(accountsInfo[0].publicKey).to.be.equal(accountPublicKey);
                    done();
                });
        });
    });

    describe('AccountPropertyTransaction - Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('add properties', (done) => {
            const addressPropertyFilter = AccountPropertyModification.createForAddress(
                PropertyModificationType.Add,
                account3.address,
            );
            const addressModification = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('getAccountProperty', () => {
        it('should call getAccountProperty successfully', (done) => {
            setTimeout(() => {
                accountHttp.getAccountProperties(accountAddress).subscribe((accountProperty) => {
                    deepEqual(accountProperty.accountProperties.address, accountAddress);
                    done();
                });
            }, 1000);
        });
    });

    describe('getAccountProperties', () => {
        it('should call getAccountProperties successfully', (done) => {
            setTimeout(() => {
                accountHttp.getAccountPropertiesFromAccounts([accountAddress]).subscribe((accountProperties) => {
                    deepEqual(accountProperties[0]!.accountProperties.address, accountAddress);
                    done();
                });
            }, 1000);
        });
    });
    describe('AccountPropertyTransaction - Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('remove properties', (done) => {
            const addressPropertyFilter = AccountPropertyModification.createForAddress(
                PropertyModificationType.Remove,
                account3.address,
            );
            const addressModification = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('ModifyMultisigAccountTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('ModifyMultisigAccountTransaction', (done) => {
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                2,
                1,
                [   new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount1.publicAccount),
                    new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount2.publicAccount),
                    new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount3.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction
                .signTransactionWithCosignatories(multisigAccount, [cosignAccount1, cosignAccount2, cosignAccount3]);

            listener.confirmed(multisigAccount.address).subscribe((transaction) => {
                done();
            });
            listener.status(multisigAccount.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            setTimeout(() => {
                accountHttp.getMultisigAccountGraphInfo(multisigAccount.address).subscribe((multisigAccountGraphInfo) => {
                    expect(multisigAccountGraphInfo.multisigAccounts.get(0)![0].
                        account.publicKey).to.be.equal(multisigAccount.publicKey);
                    done();
                });
            }, 1000);
        });
    });
    describe('getMultisigAccountInfo', () => {
        it('should call getMultisigAccountInfo successfully', (done) => {
            setTimeout(() => {
                accountHttp.getMultisigAccountInfo(multisigAccount.address).subscribe((multisigAccountInfo) => {
                    expect(multisigAccountInfo.account.publicKey).to.be.equal(multisigAccount.publicKey);
                    done();
                });
            }, 1000);
        });
    });
    describe('incomingTransactions', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('outgoingTransactions', () => {
        it('should call outgoingTransactions successfully', (done) => {
            accountHttp.outgoingTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('aggregateBondedTransactions', () => {
        it('should call aggregateBondedTransactions successfully', (done) => {
            accountHttp.aggregateBondedTransactions(publicAccount).subscribe((transactions) => {
                done();
            }, (error) => {
                console.log('Error:', error);
                assert(false);
            });
        });
    });

    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('unconfirmedTransactions', () => {
        it('should call unconfirmedTransactions successfully', (done) => {
            accountHttp.unconfirmedTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
});
