/* eslint-disable max-len */

// 유저 테이블
export const createUserTable = `
    CREATE TABLE IF NOT EXISTS user_table (
        user_id         VARCHAR(50)     NOT NULL PRIMARY KEY,
        user_email      VARCHAR(200)    NOT NULL UNQIUE,
        user_name       VARCHAR(50)     NOT NULL,
        password        VARCHAR(200)    NOT NULL,
        is_manager      BOOLEAN         NOT NULL DEFAULT FALSE,
        user_status     TINYINT(2)      NOT NULL DEFAULT 50 COMMNET '50 - 유저 어카운트, 10 - 유저 어카운트',
        created         DATETIME        NOT NULL DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX user_idx(user_status)
    )
`;

// 블록체인 네트워크 테이블
export const createNeworkTable = `
    CREATE TABLE IF NOT EXISTS network_table (
        network_seq     INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        network_name    VARCHAR(50)     NOT NULL,
        rpc_url         TEXT            NOT NULL,
        network_status  TINYINT(2)      NOT NULL DEFAULT 50 COMMENT '10 - 비활성 네트워크, 50 - 활성 네트워크',
        created         DATETIME        NOT NULL DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX network_idx(network_status)
    )
`;

// 걔정 테이블
export const createAccountTable = `
    CREATE TABLE IF NOT EXISTS account_table (
        account_seq     INT(20)         NOT NULL    AUTO_INCREMENT PRIMARY KEY,
        user_id         VARCHAR(50)     NOT NULL,
        network_seq     INT(20)         NOT NULL,
        address         VARCHAR(100)    NOT NULL,
        privatekey      TEXT            NOT NULL,
        nonce           BIGINT          NOT NULL    DEFAULT 0,
        balance         BIGINT          NOT NULL    DEFAULT 0,
        account_status  TINYINT(2)      NOT NULL    DEFAULT 50 COMMNET '50 - 활성 어카운트, 10 - 비활성 어카운트',
        created         DATETIME        NOT NULL    DEFAULT current_timestamp,
        updated         DATETIME        NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX account_idx(account_status, network_seq, user_id)
    )
`;

// 트랜잭션 테이블
export const createTransactionTable = `
    CREATE TABLE IF NOT EXISTS transaction_table (
        transaction_seq     INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        account_seq         INT(20)         NOT NULL,
        from_address        VARCHAR(300)    NOT NULL,
        to_address          VARCHAR(300)    NOT NULL,
        used_gas            BIGINT          NOT NULL,
        value               BIGINT          NOT NULL,
        tx_id               VARCHAR(300),
        tx_status           TINYINT(2)      NOT NULL DEFAULT 10 COMMENT '10 - 생성 완료, 20 - 서명 완료, 30 - pending, 50 - 전송 완료',
        created             DATETIME        NOT NULL DEFAULT current_timestamp,
        updated             DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX tx_idx(account_seq, tx_id, tx_status)
    )
`;

// 트랜잭션 로그 테이블
export const createTxSendTable = `
    CREATE TABLE IF NOT EXISTS transaction_log_table (
        tx_log_seq          INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        transaction_seq     INT(20)         NOT NULL,
        network_seq         INT(20)         NOT NULL,
        send_status         BOOLEAN         NOT NULL,
        transaction_obj     TEXT            NOT NULL,
        response            TEXT,
        created             DATETIME        NOT NULL DEFAULT current_timestamp,

        INDEX tx_log_idx(network_seq, send_status)
    )
`

// 재전송 테이블
export const createReSentTransactionTable = `
    CREATE TABLE IF NOT EXISTS resend_transaction_table (
        resend_tx_seq       INT(20)         NOT NULL AUTO_INCREMENT PRIMARY KEY,
        transaction_seq     INT(20)         NOT NULL,
        resend_status       TINYINT(2)      NOT NULL DEFAULT 10 COMMENT '10 - 재시도, 50 - 재시도 성공',
        failed_reason       TEXT            NOT NULL            COMMENT '실패 에러 내용 혹은 응답',
        retry_count         INT(20)         NOT NULL DEFAULT 0,
        created             DATETIME        NOT NULL DEFAULT current_timestamp,
        updated             DATETIME        NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,

        INDEX resend_tx_idx(transaction_seq, resend_status)
    )
`;