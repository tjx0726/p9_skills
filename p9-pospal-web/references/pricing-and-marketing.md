# Price schedules, promotions, owned coupons and count cards

Prefer applicable verified business APIs. An editor is needed only when a contract
is unknown/drifting, interaction is required or the branch is UI-only: use a configured
lightweight headless browser, then Tabbit only at tier 3, and return to API once the
contract/session is established. Never submit the same uncertain write through each tier.
Navigation below comes from official instructions checked on 2026-11-27; it is
not itself a verified API or a tested save in this session. Apply [Access and scope](access-and-scope.md) to notifications, public
availability, financial actions, real members and related stock. Creation of a rule,
issue/sale of an entitlement and redemption are separate outcomes.

## Price schedules (调价单)

Official [price-schedule instructions](https://blog.pospal.cn/kb/2479) locate the page
under `商品 → 商品中心 → 商品调价单`. Select the operation store, affected stores,
exact products, requested retail/member/wholesale prices and immediate/scheduled
execution. Verify the tenant's time zone and the form's actual date/time semantics.
Do not interpret a displayed timestamp using the computer's time zone without proof.

Capture the full current price baseline through known detail APIs, including each
member category/price tier. Reuse an applicable established schedule contract; if its
serialization is not established, observe the same editor under tier 2 / tier 3 before
writing. A nominally unchanged member price can still write
per-category `presetPrice` values. Limit the change to authorized stores and fields.
Save once through the established channel, independently query the schedule and distinguish saved/pending/executed
from its actual state. Immediate mode can involve save followed by an execution
step; investigate partial success before any repeat.

After execution, independently read affected products and their actual price tiers.
A pending scheduled document proves scheduling only. The official guide describes
editing/deleting pending schedules and using a new adjustment to restore executed
prices; do not promise an undo. Backend readback does not prove a native checkout
notification or printed label, which is outside this web-only task.

Historical Windows evidence mapped the head-office editor without a local price write.
A separate Mac scheduled `Save` and later fresh state were observed, without `Batch`.
Immediate `Save → Batch` was mapped, not independently executed. The complete wire
serialization was not captured in that local mapping, so operation names alone do
not justify guessing a request. Preserve this boundary, establish any missing contract
with tier-2 observation, and do not replay the old test or invent numeric state labels.

## Discounts, special prices and stepped offers

The official [older discount/special-price guide](https://blog.pospal.cn/kb/2195)
uses `营销 → 促销活动 → 打折/特价`. The [new stepped-offer guide](https://blog.pospal.cn/kb/28774)
uses the marketing toolbox's `梯度优惠` card/search. If no applicable verified API
contract is already available, these official page instructions guide tier-2
observation (tier 3 only when needed). Follow the version actually
visible, rather than assuming the old and new forms serialize identically.

Define target stores/products, activity dates and time slots, eligible members,
channels, quantity/amount thresholds and stacking intent. Distinguish a discount
percentage from an amount off or fixed price: `8折` corresponds to an 80% price.
Inspect excluded products, per-member limits, payment restrictions and member
discount stacking. Use the live form's units and limits.

Save a draft when the form supports the requested draft. If only publish is offered,
treat it as activation with its actual reach. Keep notification/public channels at
the requested settings; do not send SMS or broaden stores to test configuration.
Reopen the activity and verify its conditions and participation detail. A saved rule
is not proof of final checkout pricing or stacking; use an authorized web preview or
isolated test if available, otherwise report that execution remains unverified.

## Package promotions (套餐)

Official [package instructions](https://blog.pospal.cn/kb/28778) use
`营销 → 工具箱 → 套餐促销`; a category is optional organization, not a prerequisite
to create unnecessary metadata. Use an established package contract first; this
package's official navigation is not proof of an executed package-create API. If
the contract is missing, inspect that editor through tier 2 / tier 3 and choose the
authorized components/choice groups, quantities and package price, then store,
date, member, channel and stacking limits. A promotion package differs from a
stock-conversion relationship and from a count-card package.

Verify component identity and quantities, required/optional choices and the live
rule for automatic matching versus explicit package selection. Preserve existing
components on edit. Save/publish only within the current activation scope, reopen
the package detail and verify all selections. A package rule in backend data does
not establish that separate scanned items automatically assemble into that package.
Do not switch to native checkout to prove it during a web-only task.

## Owned member coupons (自有优惠券)

Official [coupon instructions](https://blog.pospal.cn/kb/2082) include the older
`营销 → 优惠券` and newer `营销 → 工具箱 → 优惠券` routes. Find the current
create/edit, targeted-issue, quantity/detail and usage-log contracts/controls only
when they are not already established. Owned coupons
are in scope; they are not third-party voucher integration.

Before a write distinguish:

- Coupon **rule/type** and its owner, eligible stores/products/members and discount.
- Individual issued **code/instance**, holder, current status and entitlement.
- Issue/claim window versus usage validity; fixed dates versus days after issue.
- Creating/editing a rule versus issuing, selling, transferring, cancelling or redeeming.

Set the requested scope, thresholds, limits, stacking and validity. Do not enable
public claiming/sales or auto-issue as part of a private test. Issuing to a member
requires that exact holder and quantity; verify the resulting instance list separately.
Report requested member/coupon details privately, and keep codes and raw lists out of logs.

Verified normal-web rule saves used
`/Promotion/SavePromotionRuleWithPromotionCashBack`; cancellation used
`/Promotion/CancelCouponCodes`. The rule owner (`couponUserId`) may differ from the
operating store (`userId`). Use those applicable APIs first with fresh rule/instance
data; inspect the form only for an unresolved/drifting contract. Do not copy old IDs or payloads.
The rule form used `promotionRuleJson`, `promotionCashBackJson` and
`calcProductSelectionRule`; retain their actual encoding and semantics. Cancellation
used repeated `codes[]`, `userId`, `promotionCouponUid` and `couponUserId`.
Independent reads include `/Promotion/LoadPromotionCouponCodes` and
`/CouponReport/ListCouponUseLog` / `SummaryCouponUseLog`; decode their JSON/HTML
envelopes and keep current store versus issuer scope distinct.
Historical evidence found no proven single-instance expiry edit. Editing a fixed-date
rule can affect already issued instances; do not use it to extend just one person's
coupon or extrapolate that behavior to relative validity.

For cancellation query the exact instance and eligible status, then independently
reread it after the known request. For usage/return requests use a verified web
contract first; when missing inspect the actual controls under tier 2 / tier 3;
if execution is offered only in checkout, report the web lookup/configuration result
and that gap. Historical independent redemption versus checkout deduction differed;
do not equate “marked used” with a financial sale or assume cancelled payment restores
the coupon. Reconcile instance state, use log and any authorized stock/payment effect.

## Independent count cards (次卡)

Official [count-card instructions](https://blog.pospal.cn/kb/109) use
`营销 → 卡券管理 → 次卡` (industry menus can differ). For a product card choose the
actual single-use product; a package card uses an existing package. Define count or
unlimited use, price, validity, per-period limits and eligible scope. Inspect online
visibility and promotion-generated product side effects. Do not invent a course
enrollment dependency: independent count cards are a separate supported module.

Create/edit only requested rules. Reopen them and verify products/package, quantity,
validity and scope. Official guidance says use count cannot be edited after creation;
do not simulate a top-up by overwriting a used card. Distinguish rule definition from
a member's held entitlement and actual purchase/redemption.

Known member-entitlement reads include `/Customer/LoadCustomerPassProducts` (`number`)
and `/Customer/LoadCustomerPassProductChangeLogs` (`customerNumber`, date range and
the known filters). These establish holdings/history, not a verified rule-creation
or redemption writer. Use an existing applicable write contract first; when only the
official page guide is known, observe it under tier 2, then tier 3 only when needed.
Use independent purchase/usage data requests after a write. If a web
role exposes purchase, issue or consume controls, establish that form's contract and perform
only the authorized action. If the available guide/control leads solely to native
checkout or a mini-program, report that boundary. Consumption can also deduct product
stock, even with the user's `void` test payment; verify rights and stock separately.

Before rule deletion inspect remaining member uses and links. Official guidance
describes irreversible rule deletion and a warning for outstanding uses. Do not clear
real entitlements to remove a test rule or substitute a refund/payment action. An
explicit refund is a separate financial scope with its own permitted web route.
