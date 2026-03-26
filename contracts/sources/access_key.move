module access_key_nft::access_key {
    use std::string::{Self, String};
    use one::event;

    /// NFT key granting access to a resource
    public struct AccessKey has key, store {
        id: object::UID,
        resource: String,
        tier: String,
        issuer: address,
        holder: address,
        valid_until_epoch: u64,
        active: bool,
    }

    public struct KeyIssued has copy, drop {
        resource: String,
        tier: String,
        holder: address,
        epoch: u64,
    }

    public struct KeyRevoked has copy, drop {
        resource: String,
        holder: address,
        epoch: u64,
    }

    const E_NOT_ISSUER: u64 = 0;
    const E_NOT_HOLDER: u64 = 1;
    const E_ALREADY_REVOKED: u64 = 2;

    public fun issue(
        raw_resource: vector<u8>,
        raw_tier: vector<u8>,
        valid_until_epoch: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let resource = string::utf8(raw_resource);
        let tier = string::utf8(raw_tier);
        let epoch = ctx.epoch();
        let issuer = ctx.sender();

        event::emit(KeyIssued { resource, tier, holder: recipient, epoch });

        transfer::transfer(AccessKey {
            id: object::new(ctx),
            resource,
            tier,
            issuer,
            holder: recipient,
            valid_until_epoch,
            active: true,
        }, recipient);
    }

    public fun revoke(key: &mut AccessKey, ctx: &mut TxContext) {
        assert!(key.issuer == ctx.sender(), E_NOT_ISSUER);
        assert!(key.active, E_ALREADY_REVOKED);
        key.active = false;
        event::emit(KeyRevoked { resource: key.resource, holder: key.holder, epoch: ctx.epoch() });
    }

    public fun burn(key: AccessKey, ctx: &TxContext) {
        assert!(key.holder == ctx.sender(), E_NOT_HOLDER);
        let AccessKey { id, resource: _, tier: _, issuer: _, holder: _, valid_until_epoch: _, active: _ } = key;
        object::delete(id);
    }

    public fun resource(k: &AccessKey): &String { &k.resource }
    public fun tier(k: &AccessKey): &String { &k.tier }
    public fun holder(k: &AccessKey): address { k.holder }
    public fun active(k: &AccessKey): bool { k.active }
}
