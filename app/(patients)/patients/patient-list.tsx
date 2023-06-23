"use client";

import { createContext, useContext, useMemo, useState } from "react";
import DataGrid, {
  type Column,
  type RenderHeaderCellProps,
} from "react-data-grid";
import { type z } from "zod";

import { type patientSchema } from "@/lib/schema";

type PatientData = z.infer<typeof patientSchema>;

interface Row extends PatientData {}

interface Filter
  extends Omit<Row, "password" | "salt" | "ssn" | "gender" | "birthDate"> {}

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.stopPropagation();
  }
}

function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.stopPropagation();
  }
}

interface Props {
  patients: PatientData[];
}

export default function PatientList({ patients: rows }: Props) {
  const [filters, setFilters] = useState<Filter>({
    username: "",
    prefix: "",
    firstName: "",
    lastName: "",
  });

  const columns = useMemo((): readonly Column<Row>[] => {
    return [
      {
        key: "username",
        name: "Username",
      },
      {
        key: "prefix",
        name: "Prefix",
        renderHeaderCell: (p) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                value={filters.prefix}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    prefix: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      {
        key: "firstName",
        name: "First Name",
        renderHeaderCell: (p) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                value={filters.firstName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    firstName: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
      {
        key: "lastName",
        name: "Last Name",
        renderHeaderCell: (p) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                value={filters.lastName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    lastName: e.target.value,
                  })
                }
                onKeyDown={inputStopPropagation}
              />
            )}
          </FilterRenderer>
        ),
      },
    ];
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return (
        (filters?.username ? row.username.includes(filters.username) : true) &&
        (filters?.prefix ? row.prefix.includes(filters.prefix) : true) &&
        (filters?.firstName
          ? row.firstName.includes(filters.firstName)
          : true) &&
        (filters?.lastName ? row.lastName.includes(filters.lastName) : true)
      );
    });
  }, [rows, filters]);

  function clearFilters() {
    setFilters({
      username: "",
      prefix: "",
      firstName: "",
      lastName: "",
    });
  }

  return (
    <div className="">
      <FilterContext.Provider value={filters}>
        <DataGrid
          columns={columns}
          rows={filteredRows}
          renderers={{
            noRowsFallback: <>Loading...</>,
          }}
          rowKeyGetter={(row) => row.username}
          headerRowHeight={64}
          rowHeight={32}
          className="w-full h-full rdg-light"
        />
      </FilterContext.Provider>
    </div>
  );
}

function FilterRenderer<R>({
  tabIndex,
  column,
  children,
}: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  return (
    <div className="flex flex-col">
      <div className="flex-1">{column.name}</div>
      <div className="flex-1 border border-red-500">
        {children({ tabIndex, filters })}
      </div>
    </div>
  );
}
