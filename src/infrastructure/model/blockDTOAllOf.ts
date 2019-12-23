/*
 * Copyright 2019 NEM
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
/**
 * Catapult REST Endpoints
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.7.20.6
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export class BlockDTOAllOf {
    /**
    * Height of the blockchain.
    */
    'height': string;
    /**
    * Number of seconds elapsed since the creation of the nemesis block.
    */
    'timestamp': string;
    /**
    * Defines how difficult it will be to harvest next the block, based on previous blocks.
    */
    'difficulty': string;
    'previousBlockHash': string;
    'transactionsHash': string;
    'receiptsHash': string;
    'stateHash': string;
    'beneficiaryPublicKey': string;
    /**
    * Fee multiplier applied to transactions contained in block.
    */
    'feeMultiplier': number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "height",
            "baseName": "height",
            "type": "string"
        },
        {
            "name": "timestamp",
            "baseName": "timestamp",
            "type": "string"
        },
        {
            "name": "difficulty",
            "baseName": "difficulty",
            "type": "string"
        },
        {
            "name": "previousBlockHash",
            "baseName": "previousBlockHash",
            "type": "string"
        },
        {
            "name": "transactionsHash",
            "baseName": "transactionsHash",
            "type": "string"
        },
        {
            "name": "receiptsHash",
            "baseName": "receiptsHash",
            "type": "string"
        },
        {
            "name": "stateHash",
            "baseName": "stateHash",
            "type": "string"
        },
        {
            "name": "beneficiaryPublicKey",
            "baseName": "beneficiaryPublicKey",
            "type": "string"
        },
        {
            "name": "feeMultiplier",
            "baseName": "feeMultiplier",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return BlockDTOAllOf.attributeTypeMap;
    }
}

