import { Clock3, Mail } from "lucide-react";

function PendingApprovalStatus() {
  return (
    <div className="mt-8 space-y-8">

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-amber-100 p-3">
            <Clock3
              size={24}
              className="text-amber-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-amber-700">
              Pending Review
            </h2>

            <p className="mt-1 text-sm text-amber-700">
              Your profile is currently under admin review.
            </p>
          </div>

        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary">
            Review Time
          </p>

          <p className="mt-2 text-lg font-semibold text-text-primary">
            Within 24–48 Hours
          </p>
        </div>

        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary">
            Current Status
          </p>

          <p className="mt-2 font-semibold text-amber-600">
            Pending Approval
          </p>
        </div>

      </div>

      <div className="rounded-xl border border-border bg-background p-5">

        <div className="flex items-center gap-3">

          <Mail
            size={20}
            className="text-primary"
          />

          <div>
            <p className="font-medium text-text-primary">
              Need Help?
            </p>

            <p className="text-sm text-text-secondary">
              Contact support if you have any questions about
              your company verification.
            </p>

            <p className="mt-2 font-medium text-primary">
              support@hireflow.com
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PendingApprovalStatus;