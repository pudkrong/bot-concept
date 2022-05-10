# Concept
The major problem we are facing today is the scalability due to the mix of everything in one place. So, we have to re-design by separating each component based on their responsibility. in addition, we will use bot framework to help our team to develop faster. `bottender`, [https://bottender.js.org/](https://bottender.js.org/), is the one. It provides simple routes and common interface to communicate with many platforms. Session is another thing that it helps you a lot in term of multi-turn dialog.

# Components
- Channel (Bottender)
- Decision (Skills)
- NLU (language analysis)

## Channel
`bottender` is used mainly in this part because it provides us many benefits

- Integrate with many platforms i.e. Whatsapp, Telegram, Line, Messenger
- Session management
- Webhook management

Channel is a thin layer because it just receives messages from webhook and calls external services named `decision` (business rule) in order to get reply message.

## Decision (Skills) not NodeRED
This component contains skills (Alexa term). This is where it takes messages from platform, then pass it through `NLU` to extract the intent and entities. Once it receives the intent, it will load the skill schema associated to the given intent.

Schema is simply json format telling what entities are required to fulfill the skills. We can modify this logic to add more features like

- Input validation
- Questions to acquire the missing entities
- Action after the skill is fulfilled

## NLU
It is separated from `decision` because it is easier to swap in with custom NLU or other providers as long as it returns the same format.

Basically, it takes message as input and returns intents and/or entities from the message.


# Workflow
```
https://mermaid.live/view#pako:eNplVMFu2zAM_RXCQIENaNGlveWwoU26XoKuQHsZFB84m6mF2pItyWmDOP8-SrITN06QhAwfH8lHWfsk0zkl8-TNYF3A63KtgF_WoXHixX-ncHX1E4wla4Uh67Qh8I7U6pphjtKYEhABS1I5Um4ff0AqCLhfhwjswx7aPXUQvR_iafWcTgF_O2BzFgM9NBSJtqBPZzBzvXvNH-kk2XScEJtisMUtnSO9r2E8yChjxvyUtY6Aa_DA8A8t5cDGmGV3HPHEMAsUMUvcxWS0VmeSYTlwycjQZ_T0Pmfrpet5t1jKfNBtO9LEltrtN225kWVJUwTLimN1FH1ApBzqDUOqUG0CGxjVqKbxjHwCyH0ZVo2KNv2izJG-V8Dh-1TDSVdqJEOmq7okRzMxWD3Ij36qJzBrWslHspJ8JNXbV8ImrqG5iavvsTkc13a2-uYm4m-FJZVD0_J59w1tJXJDvLDPYWHNbUCG5-SsL5ZqaFksTr3Ht0deXMCdWBRGWlehDc9X98iqVlrRroP7b4_cVaHrmuf5fky5DwUX-5VHErhCqvfDMboILH8UdbAUK6ydrtOz4OuH7uBByOeC60yChSHO_S02ON_gVYYGFmjS5DKpyFQoc74i9j5nnbiCKlonczZz2mBbunWyVgeGtnXOWj7kki-JZO5MS5cJtk6_7FQ2-BGzlMgXThX_PPwHEy2EUA
```

![Workflow](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ec38120e-1d30-4c23-8845-5f6195dd1887/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220510T040450Z&X-Amz-Expires=86400&X-Amz-Signature=9ef321ef29f88d93fe7d35f734e0af1ae2a5c102527c718b829c71d35b2914ba&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

# Bottender Life Cycle
```
https://mermaid.live/edit#pako:eNplktFu2zAMRX-FEFCgBZJ9QB4GrEnbBSiwYe2bnAfOYmxhtqTSVLMiyb9PljUjbe0H-4rnkheSjqr2htRKNYyhhedN5SA9gyCLrlSNXQe_vXypmVDoF71EGuQ7OtMRX99UagfL5VcYaBj01lmxCcrKercrrZLKkHdML1rYNg1xUqVZwXI1c_RKTnSPIVjXAE8UiJ8KQ-GzmIdvjW7IEV-MB2suEmxNZply1PQRzx-TTsXMxZC5SqExEAfiBTTsY1hA3aJz1I15ijttwuSfTNkfuthYNzagv1THlKqszHDRmcZaUp9LuqzMdNGZPuRoB7bvtnp8R_LqCr7pdct2kB6HfDynBxLovaO3E9xeP6Tgrc-bezNbbnPn9fFxJAmkte7Pea6uc5cfjk6w0Y8YxIfdh-LzwZ_gTtufbZrzqdgyJe-93uNqj8saGdbIO7VQPXGP1qT7dxw9lZKWeqrUKv0a2mPspFKVOyc0BpNO987YdHJqJRxpoTCKf3pz9X89MRuL6Tb30-L5H_TK9yQ
```

![Life Cycle](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c48b4399-0efc-4b5a-bad6-5fbd7a99f119/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220510T040612Z&X-Amz-Expires=86400&X-Amz-Signature=c41b32053161ee3be0f14f32fbb745f247e47e9cba4a90beaac7a657109d7019&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

