/*========== Manual ==========
# Input(obj)
networkType:　mainnet or testnet
senderPrivateKey: 送り元の秘密鍵
transferable: 発行者以外が送信できるかどうか(true or false)
duration: Mosaicが存在できるブロック数
fee: 手数料
deadlineHours: 有効期限[h]

# Output
mosaicId: 発行したMosaicIDの16進数表現
mosaicDefinitionTx: 実際のトランザクション
keyPair: 署名時に必要な秘密鍵/公開鍵
facade: mainnet or testnetの指定をしているがそれが一貫性を保てるように引き継ぐ
========== Manual ==========*/
import { PrivateKey } from 'symbol-sdk';
import { SymbolFacade } from 'symbol-sdk/symbol';
import { generateMosaicId } from 'symbol-sdk/symbol';

export function CreateMosaicTx({
    networkType = 'testnet',
    senderPrivateKey,
    transferable = true,
    duration = 86400n,
    fee = 1_000_000n,
    deadlineHours = 2
}) {
    // Startup Log
    const logOwner = "CreateMosaicTx";
    console.log(`\n[${logOwner}] ${logOwner}-Function is running!\n`);
    // I/O Log
    console.log(`[${logOwner}] Input => 
        networkType: ${networkType},\n
        senderPrivateKey: ${senderPrivateKey},\n         
        transferable: ${transferable},\n
        duration: ${duration},\n
        fee: ${fee},\n
        deadlineHours: ${deadlineHours}`
    );
    // Facade初期化
    const facade = new SymbolFacade(networkType);
    // 秘密鍵を解釈
    const privateKey = new PrivateKey(senderPrivateKey.trim());
    // 秘密鍵 → KeyPair
    const keyPair = facade.createAccount(privateKey);
    // Deadline 作成
    const safeDeadlineHours = Math.min(Math.max(Number(deadlineHours) || 2, 1), 2);
    const deadline = facade.network
        .fromDatetime(new Date())
        .addHours(safeDeadlineHours)
        .timestamp;
    // 0〜2^32-1のランダム数からMosaicIDを生成するためのnonceを生成
    const nonce = (Math.random() * 0xffffffff) >>> 0;
    // flagsの2進数の1の場所でMosaicを設定
    let flags = 0;
    // 追加供給が可能
    flags |= 0x01;
    // transferableがtrueなら他人から他人への送金を可能にする
    if (transferable) flags |= 0x02;

    // ★ mosaicIdは計算だけする（Txには入れない）
    const ownerAddress = facade.network.publicKeyToAddress(keyPair.publicKey);
    const mosaicIdBigInt = generateMosaicId(ownerAddress, nonce);
    const mosaicIdHex = mosaicIdBigInt
        .toString(16)
        .toUpperCase()
        .padStart(16, '0');

    const mosaicDefinitionTx = facade.transactionFactory.create({
        type: 'mosaic_definition_transaction_v1',
        signerPublicKey: keyPair.publicKey,
        fee: BigInt(fee),
        duration: BigInt(duration),
        nonce: nonce,
        flags: flags,
        divisibility: 0,
        deadline: deadline
    });

    return {
        mosaicId: mosaicIdHex,
        mosaicDefinitionTx,
        keyPair,
        facade
    };
}